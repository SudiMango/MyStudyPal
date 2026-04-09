"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { TokenStore } from "@/lib/token-store";
import {
    getLoggedInUser,
    loginWithEmail,
    logoutFromApp,
} from "@/lib/api/auth-api";
import { UserDetailsResponse } from "@/lib/dto/auth-dto";
import { toast } from "sonner";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserDetailsResponse | null;
    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        () => TokenStore.get() !== null,
    );
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await getLoggedInUser();

                if (res.success && res.data) {
                    setIsAuthenticated(true);
                    setUser(res.data);
                } else {
                    TokenStore.set(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch {
                TokenStore.set(null);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

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

            const userRes = await getLoggedInUser();
            if (userRes.success && userRes.data) {
                setUser(userRes.data);
                setIsAuthenticated(true);
                return { success: true };
            } else {
                TokenStore.set(null);
                return {
                    success: false,
                    error: "Failed to fetch user details",
                };
            }
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
            toast.error(result.error);
        }
    };

    // const isAppRoute = pathname.startsWith("/app");

    // if (isLoading && isAppRoute) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <p>Loading...</p>
    //         </div>
    //     );
    // }

    // if (!isAuthenticated && isAppRoute) {
    //     return (
    //         <div className="flex items-center justify-center h-screen">
    //             <p>Redirecting to login...</p>
    //         </div>
    //     );
    // }

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
