// contexts/auth-context.tsx
"use client";
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User, authAPI } from '@/app/api/auth/login';
import { tokenManager } from '@/app/api/axios';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    tokenExpiringSoon: boolean;
}

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_FAILURE'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_TOKEN_EXPIRING'; payload: boolean };

interface AuthContextType extends AuthState {
    // eslint-disable-next-line no-unused-vars
    login: (email: string, password: string) => Promise<void>;
    // eslint-enabled-next-line no-unused-vars
    logout: () => Promise<void>;
    clearError: () => void;
    checkAuth: () => Promise<void>;
    refreshTokens: () => Promise<void>;
    getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
                tokenExpiringSoon: false,
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
                tokenExpiringSoon: false,
            };
        case 'AUTH_LOGOUT':
            return {
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                tokenExpiringSoon: false,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_TOKEN_EXPIRING':
            return {
                ...state,
                tokenExpiringSoon: action.payload,
            };
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

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();

    // Check token expiration periodically
    useEffect(() => {
        const checkTokenExpiration = () => {
            const isExpiringSoon = authAPI.isTokenExpiringSoon();
            dispatch({ type: 'SET_TOKEN_EXPIRING', payload: isExpiringSoon });

            if (isExpiringSoon && state.isAuthenticated) {
                console.log('Token expiring soon, consider refreshing...');
            }
        };

        // Check immediately
        checkTokenExpiration();

        // Check every minute
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, [state.isAuthenticated]);

    const checkAuth = useCallback(async (): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Check if we have valid tokens first
            if (!authAPI.isAuthenticated()) {
                dispatch({ type: 'AUTH_LOGOUT' });
                queryClient.clear();
                return;
            }

            // Try to get user data
            const user = await authAPI.getCurrentUser();
            dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } catch (error) {
            console.error('Auth check failed:', error);
            dispatch({ type: 'AUTH_LOGOUT' });
            queryClient.clear();

            // If we're on a protected route, redirect to login
            if (!pathname.startsWith('/auth/')) {
                const redirectUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}&reason=session_expired`;
                router.push(redirectUrl);
            }
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [queryClient, router, pathname]);

    // Initial auth check
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, password: string): Promise<void> => {
        dispatch({ type: 'AUTH_START' });

        try {
            const response = await authAPI.login({ email, password });
            dispatch({ type: 'AUTH_SUCCESS', payload: response.user });
            queryClient.invalidateQueries();

            // Redirect to intended page or dashboard
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect') || '/home_services/dashboard';
            router.push(redirect);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            await authAPI.logout();
            dispatch({ type: 'AUTH_LOGOUT' });
            queryClient.clear();
            router.push('/auth/login?reason=logged_out');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local state even if server logout fails
            dispatch({ type: 'AUTH_LOGOUT' });
            queryClient.clear();
            router.push('/auth/login?reason=session_cleared');
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const refreshTokens = async (): Promise<void> => {
        try {
            await authAPI.refreshTokens();
            // Re-check auth to get updated user data if needed
            await checkAuth();
        } catch (error) {
            console.error('Token refresh failed:', error);
            await logout();
        }
    };

    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const getAccessToken = (): string | null => {
        return tokenManager.getAccessToken();
    };

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        clearError,
        checkAuth,
        refreshTokens,
        getAccessToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};