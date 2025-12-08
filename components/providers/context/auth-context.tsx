// contexts/auth-context.tsx
"use client";

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { User, authAPI } from "@/app/api/auth/login";
import { tokenManager } from "@/app/api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";

/** ─────────────────────────────────────────────
 * TYPES
 * ───────────────────────────────────────────── */
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    tokenExpiringSoon: boolean;
}

type AuthAction =
    | { type: "AUTH_START" }
    | { type: "AUTH_SUCCESS"; payload: User }
    | { type: "AUTH_FAILURE"; payload: string }
    | { type: "AUTH_LOGOUT" }
    | { type: "CLEAR_ERROR" }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_TOKEN_EXPIRING"; payload: boolean };

interface AuthContextType extends AuthState {
    // eslint-disable-next-line no-unused-vars
    login: (email: string, password: string, redirectUrl?: string | null) => Promise<void>;
    // eslint-enable-next-line no-unused-vars
    logout: () => Promise<void>;
    clearError: () => void;
    checkAuth: () => Promise<void>;
    refreshTokens: () => Promise<void>;
    getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** ─────────────────────────────────────────────
 * REDUCER
 * ───────────────────────────────────────────── */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "AUTH_START":
            return { ...state, isLoading: true, error: null };

        case "AUTH_SUCCESS":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                tokenExpiringSoon: false,
            };

        case "AUTH_FAILURE":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case "AUTH_LOGOUT":
            return {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                tokenExpiringSoon: false,
            };

        case "CLEAR_ERROR":
            return { ...state, error: null };

        case "SET_LOADING":
            return { ...state, isLoading: action.payload };

        case "SET_TOKEN_EXPIRING":
            return { ...state, tokenExpiringSoon: action.payload };

        default:
            return state;
    }
};

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false, // Start as false, will be set by checkAuth if needed
    error: null,
    tokenExpiringSoon: false,
};

/** ─────────────────────────────────────────────
 * PROVIDER
 * ───────────────────────────────────────────── */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();
    const isCheckingAuthRef = useRef(false);
    const isRefreshingRef = useRef(false);
    const isLoggingInRef = useRef(false);

    /** ─────────────────────────────────────────────
     * UTILS
     * ───────────────────────────────────────────── */
    const clearError = useCallback(() => {
        dispatch({ type: "CLEAR_ERROR" });
    }, []);

    const getAccessToken = useCallback(() => {
        return tokenManager.getAccessToken();
    }, []);

    /** ─────────────────────────────────────────────
     * REFRESH TOKENS
     * ───────────────────────────────────────────── */
    const refreshTokens = useCallback(async () => {
        // Prevent multiple simultaneous refresh attempts
        if (isRefreshingRef.current) {
            return;
        }

        isRefreshingRef.current = true;

        try {
            await authAPI.refreshTokens();
            // Re-validate auth after refresh
            if (authAPI.isAuthenticated()) {
                const user = await authAPI.getCurrentUser();
                dispatch({ type: "AUTH_SUCCESS", payload: user });
            }
        } catch {
            dispatch({ type: "AUTH_LOGOUT" });
            queryClient.clear();
        } finally {
            isRefreshingRef.current = false;
        }
    }, [queryClient]);

    /** ─────────────────────────────────────────────
     * TOKEN EXPIRATION CHECKER & PROACTIVE REFRESH
     * ───────────────────────────────────────────── */
    useEffect(() => {
        if (!state.isAuthenticated) return;

        const checkTokenExpiration = () => {
            const isExpiringSoon = authAPI.isTokenExpiringSoon();
            dispatch({ type: "SET_TOKEN_EXPIRING", payload: isExpiringSoon });
            if (isExpiringSoon && state.isAuthenticated && !state.isLoading && !isRefreshingRef.current) {
                refreshTokens().catch(() => {
                });
            }
        };
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, [state.isAuthenticated, state.isLoading, refreshTokens]);
    const checkAuth = useCallback(async () => {
        if (isLoggingInRef.current) {
            return;
        }
        if (isCheckingAuthRef.current) {
            return;
        }
        isCheckingAuthRef.current = true;
        if (!isLoggingInRef.current) {
            dispatch({ type: "SET_LOADING", payload: true });
        }
        try {
            if (!authAPI.isAuthenticated()) {
                dispatch({ type: "AUTH_LOGOUT" });
                queryClient.clear();
                return;
            }

            const user = await authAPI.getCurrentUser();
            if (user) {
                dispatch({ type: "AUTH_SUCCESS", payload: user });
            } else {
                throw new Error("No user data returned");
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Authentication failed";
            const isExpired = errorMessage.toLowerCase().includes("expired") ||
                errorMessage.toLowerCase().includes("session");

            dispatch({ type: "AUTH_LOGOUT" });
            queryClient.clear();

            // Only redirect if not already on auth page
            if (!pathname.startsWith("/auth/")) {
                const reason = isExpired ? "session_expired" : "authentication_required";

                router.push(
                    `/auth/login?redirect=${encodeURIComponent(pathname)}&reason=${reason}`
                );
            }
        } finally {
            // Only reset loading if login is not in progress
            if (!isLoggingInRef.current) {
                dispatch({ type: "SET_LOADING", payload: false });
            }
            isCheckingAuthRef.current = false;
        }
    }, [pathname, queryClient, router]);

    /** ─────────────────────────────────────────────
     * LOGOUT
     * ───────────────────────────────────────────── */
    const logout = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            await authAPI.logout();
        } catch (error) {
            console.warn("Logout API call failed, clearing local session anyway.", error);
        }

        dispatch({ type: "AUTH_LOGOUT" });
        queryClient.clear();

        // Only redirect if not already on auth page
        if (!pathname.startsWith("/auth/")) {
            router.push("/auth/login?reason=logged_out");
        }
    }, [pathname, queryClient, router]);

    // Run on first mount only, but skip on auth pages
    useEffect(() => {
        // Don't check auth on login/register pages
        if (pathname.startsWith("/auth/")) {
            dispatch({ type: "SET_LOADING", payload: false });
            return;
        }
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    /** ─────────────────────────────────────────────
     * LISTEN FOR LOGOUT EVENTS FROM AXIOS INTERCEPTOR
     * ───────────────────────────────────────────── */
    useEffect(() => {
        const handleLogout = (event: Event) => {
            const customEvent = event as CustomEvent<{ reason?: string }>;
            const reason = customEvent.detail?.reason || "session_expired";

            logout().then(() => {
                if (!pathname.startsWith("/auth/")) {
                    router.push(
                        `/auth/login?redirect=${encodeURIComponent(pathname)}&reason=${reason}`
                    );
                }
            }).catch(() => {
            });
        };

        window.addEventListener("auth:logout", handleLogout);
        return () => {
            window.removeEventListener("auth:logout", handleLogout);
        };
    }, [pathname, router, logout]);

    /** ─────────────────────────────────────────────
     * LOGIN
     * ───────────────────────────────────────────── */
    const login = useCallback(async (email: string, password: string, customRedirect?: string | null) => {
        // If login is already in progress, reset it first (safety measure)
        if (isLoggingInRef.current) {
            console.warn("Login already in progress - resetting");
            isLoggingInRef.current = false;
            dispatch({ type: "SET_LOADING", payload: false });
        }

        isLoggingInRef.current = true;
        dispatch({ type: "AUTH_START" });

        // Safety timeout to prevent infinite loading (20 seconds - slightly longer than axios timeout)
        const timeoutId = setTimeout(() => {
            if (isLoggingInRef.current) {
                isLoggingInRef.current = false;
                dispatch({ type: "SET_LOADING", payload: false });
                dispatch({ type: "AUTH_FAILURE", payload: "Login request timed out. Please check your connection and try again." });
            }
        }, 20000);

        try {
            const response = await authAPI.login({ email, password });
            clearTimeout(timeoutId);

            if (!response?.user) {
                throw new Error("Invalid response from server");
            }

            isLoggingInRef.current = false;
            dispatch({ type: "AUTH_SUCCESS", payload: response.user });

            // Invalidate queries (non-blocking, don't await)
            queryClient.invalidateQueries().catch((err) => {
                console.warn("Failed to invalidate queries:", err);
            });

            // Get redirect URL from query params or default
            const redirect =
                customRedirect ??
                new URLSearchParams(window.location.search).get("redirect") ??
                "/home-services/dashboard"; // 3️⃣ default

            // Ensure redirect is safe (same origin, no external URLs)
            const redirectUrl = redirect.startsWith("/") && !redirect.startsWith("//")
                ? redirect
                : "/home-services/dashboard";
            setTimeout(() => {
                try {
                    router.push(redirectUrl);
                } catch {
                    if (typeof window !== "undefined") {
                        router.push(redirectUrl)
                    }
                }
            }, 100);
        } catch (error: unknown) {
            clearTimeout(timeoutId);
            isLoggingInRef.current = false;
            dispatch({ type: "SET_LOADING", payload: false });
            let errorMessage = "Login failed. Please try again.";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "object" && error !== null) {
                if ("response" in error) {
                    const axiosError = error as {
                        response?: {
                            status?: number;
                            data?: {
                                message?: string;
                                error?: string;
                                detail?: string;
                                errors?: Array<string | { message?: string }>;
                            }
                        }
                    };

                    const responseData = axiosError.response?.data;
                    if (responseData) {
                        // Try multiple error message fields
                        if (responseData.message) {
                            errorMessage = responseData.message;
                        } else if (responseData.error) {
                            errorMessage = responseData.error;
                        } else if (responseData.detail) {
                            errorMessage = responseData.detail;
                        } else if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
                            errorMessage = responseData.errors
                                .map((err: any) => err.message || err.msg || err.error || String(err))
                                .join(", ");
                        }
                    }
                } else if ("message" in error) {
                    errorMessage = String((error as { message: unknown }).message);
                }
            } else if (typeof error === "string") {
                errorMessage = error;
            }

            dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
            throw error; // Allows UI to show errors
        }
    }, [queryClient, router]);


    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                clearError,
                checkAuth,
                refreshTokens,
                getAccessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

/** ─────────────────────────────────────────────
 * HOOK
 * ───────────────────────────────────────────── */
export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
};
