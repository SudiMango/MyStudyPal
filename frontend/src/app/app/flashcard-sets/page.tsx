"use client";

import { makeProtectedCall } from "@/lib/api/protected-test-api";
import React from "react";
import { useAuth } from "@/app/components/global/AuthProvider";

const page = () => {
    const { logout } = useAuth();

    const handleButtonPress = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await makeProtectedCall();
        console.log(result);

        if (result.success) {
            alert(result.data);
        } else {
            alert(result.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)]">
            <label>Flashcard Sets Page</label>
            <button onClick={handleButtonPress}>Make Protected Call</button>

            {/* Logout Button */}
            <button
                onClick={logout}
                style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default page;
