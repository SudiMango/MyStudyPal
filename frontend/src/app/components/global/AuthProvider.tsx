"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import apiClient from "@/lib/api/client";
import { TokenStore } from "@/lib/token-store";
import { loginWithEmail, logoutFromApp } from "@/lib/api/auth-api";

interface User {
    username: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    // Check auth status of user on every page visit
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const { data } = await apiClient.post("/auth/refresh");
                if (data.accessToken) {
                    TokenStore.set(data.accessToken);
                    setIsAuthenticated(true);
                } else {
                    throw new Error("No access token");
                }
            } catch (error) {
                TokenStore.set(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, [pathname]);

    useEffect(() => {
        if (isLoading) return;

        const isAppRoute = pathname.startsWith("/app");

        if (!isAuthenticated && isAppRoute) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, pathname, router]);

    const login = async (email: string, password: string) => {
        const result = await loginWithEmail(email, password);
        if (result.success && result.data) {
            TokenStore.set(result.data.accessToken);
            setIsAuthenticated(true);
            return { success: true };
        } else {
            return { success: false, error: result.error };
        }
    };

    const logout = async () => {
        const result = await logoutFromApp();
        if (result.success) {
            TokenStore.set(null);
            setUser(null);
            setIsAuthenticated(false);
        } else {
            alert(result.error);
        }
    };

    const isAppRoute = pathname.startsWith("/app");

    if (isLoading && isAppRoute) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated && isAppRoute) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
