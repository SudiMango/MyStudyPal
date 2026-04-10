"use client";

import { resendVerificationEmail, verifyEmail } from "@/lib/api/auth-api";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const VerifyAccount = () => {
    const searchParams = useSearchParams();
    const initialEmail = searchParams.get("email") || "";

    const [email, setEmail] = useState<string>(initialEmail);
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const verifyAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!initialEmail) {
            toast.error("Email field isn't set properly.");
        }

        if (!code) {
            toast.error("Please enter your verification code.");
        }

        setLoading(true);
        const result = await verifyEmail(email, code);

        if (result.success) {
            redirect(`/login?email=${email}`);
        } else {
            toast.error(result.error);
        }

        setLoading(false);
    };

    const resendVerificationCode = async () => {
        if (!initialEmail) {
            toast.error("Email field isn't set properly.");
        }

        const result = await resendVerificationEmail(email);
        if (result.success) {
            toast.error(
                "Successfully resent verification code email. Please check your email again.",
            );
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)]">
            <div className="bg-(--discord-gray-2) flex flex-col items-center justify-center rounded-2xl p-5 shadow-xl space-y-4">
                {/* Title */}
                <div className="flex flex-col items-center justify-center">
                    <label className="font-extrabold text-2xl text-white">
                        Verify your email
                    </label>
                    <label className="font-light text-white opacity-65">
                        Check your email for a code
                    </label>
                </div>

                {/* Form */}
                <form className="space-y-4 w-full" onSubmit={verifyAccount}>
                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-md">
                            Email Address
                        </label>
                        <input
                            className="w-full p-1.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-(--discord-blurple) focus:border-transparent outline-none text-(--discord-gray-1)/90"
                            type="email"
                            id="email"
                            value={initialEmail}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Verification code */}
                    <div className="flex flex-col">
                        <label htmlFor="verificationCode" className="text-md">
                            Verification code
                        </label>
                        <input
                            className="w-full p-1.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-(--discord-blurple) focus:border-transparent outline-none text-gray-900"
                            type="text"
                            id="verificationCode"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="123456"
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) w-full text-xl font-bold py-1.5 rounded-md mt-1 hover:cursor-pointer"
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>

                {/* Resend verification email button */}
                <div className="text-xs opacity-60 mt-3">
                    <label>Didn't get an email?&nbsp;</label>
                    <button
                        onClick={resendVerificationCode}
                        disabled={loading}
                        className="text-(--discord-blurple) hover:text-(--discord-blurple-hover) underline"
                    >
                        Resend email.
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyAccount;
