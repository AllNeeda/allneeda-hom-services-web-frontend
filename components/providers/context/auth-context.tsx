// contexts/auth-context.tsx
"use client";

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
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
    login: (email: string, password: string) => Promise<void>;
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
    isLoading: true,
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

    /** ─────────────────────────────────────────────
     * TOKEN EXPIRATION CHECKER
     * ───────────────────────────────────────────── */
    useEffect(() => {
        const checkTokenExpiration = () => {
            const isExpiringSoon = authAPI.isTokenExpiringSoon();
            dispatch({ type: "SET_TOKEN_EXPIRING", payload: isExpiringSoon });
        };

        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, []);

    /** ─────────────────────────────────────────────
     * CHECK AUTH ON APP LOAD / ROUTE CHANGE
     * ───────────────────────────────────────────── */
    const checkAuth = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            if (!authAPI.isAuthenticated()) {
                dispatch({ type: "AUTH_LOGOUT" });
                queryClient.clear();
                return;
            }

            const user = await authAPI.getCurrentUser();
            dispatch({ type: "AUTH_SUCCESS", payload: user });
        } catch {
            dispatch({ type: "AUTH_LOGOUT" });
            queryClient.clear();

            if (!pathname.startsWith("/auth/")) {
                router.push(
                    `/auth/login?redirect=${encodeURIComponent(pathname)}&reason=session_expired`
                );
            }
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    }, [pathname, queryClient, router]);

    // Run on first mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    /** ─────────────────────────────────────────────
     * LOGIN
     * ───────────────────────────────────────────── */
    const login = async (email: string, password: string) => {
        dispatch({ type: "AUTH_START" });

        try {
            const response = await authAPI.login({ email, password });
            dispatch({ type: "AUTH_SUCCESS", payload: response.user });

            queryClient.invalidateQueries();

            const redirect =
                new URLSearchParams(window.location.search).get("redirect") ||
                "/home-services/dashboard";

            router.push(redirect);
        } catch (error: any) {
            const msg =
                error?.message ||
                error?.response?.data?.message ||
                "Login failed. Please try again.";

            dispatch({ type: "AUTH_FAILURE", payload: msg });
            throw error; // 🔥 allows UI to show errors too
        }
    };

    /** ─────────────────────────────────────────────
     * LOGOUT
     * ───────────────────────────────────────────── */
    const logout = async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            await authAPI.logout();
        } catch {
            console.warn("Logout failed, clearing local session anyway.");
        }

        dispatch({ type: "AUTH_LOGOUT" });
        queryClient.clear();
        router.push("/auth/login?reason=logged_out");
    };

    /** ─────────────────────────────────────────────
     * REFRESH TOKENS
     * ───────────────────────────────────────────── */
    const refreshTokens = async () => {
        try {
            await authAPI.refreshTokens();
            await checkAuth();
        } catch (error) {
            console.error("Token refresh failed:", error);
            await logout();
        }
    };

    /** ─────────────────────────────────────────────
     * UTILS
     * ───────────────────────────────────────────── */
    const clearError = () => dispatch({ type: "CLEAR_ERROR" });
    const getAccessToken = () => tokenManager.getAccessToken();

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
