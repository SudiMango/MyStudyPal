"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TokenStore } from "@/lib/token-store";

function OAuthCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            TokenStore.set(token);
            router.push("/app/study-sets");
        } else {
            router.push(
                "/login?error=OAuth2 authentication failed. Please try again.",
            );
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Please wait, completing login...</p>
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense>
            <OAuthCallbackContent />
        </Suspense>
    );
}
