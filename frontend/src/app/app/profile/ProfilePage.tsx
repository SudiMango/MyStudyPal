"use client";

import { useAuth } from "@/app/components/global/AuthProvider";
import { formatDate } from "@/lib/util";
import { Loader } from "lucide-react";

const ProfilePage = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <Loader className="w-10 h-10 animate-spin text-gray-400" />
                <p className="mt-4 text-gray-400">Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center w-full py-20">
                <p className="text-gray-400 text-lg">Profile not available</p>
            </div>
        );
    }

    const username = user.username?.split("@")[0] ?? "user";

    return (
        <div className="flex flex-col items-center min-h-screen w-full p-5 mt-5 overflow-x-hidden">
            <div className="flex flex-col justify-center items-center w-full h-full max-w-150">
                <div className="flex flex-row items-center w-full mb-6">
                    <label className="mr-auto text-3xl font-bold">
                        👤 Profile
                    </label>
                </div>

                <div className="bg-(--discord-gray-3) w-full rounded-xl shadow-lg p-5 outline outline-(--discord-blurple)">
                    <div className="flex flex-row items-center mb-5">
                        <div className="w-14 h-14 rounded-full bg-(--discord-blurple) flex items-center justify-center shrink-0">
                            <span className="text-xl font-bold text-white">
                                {username[0]?.toUpperCase()}
                            </span>
                        </div>
                        <div className="ml-4">
                            <p className="text-xl font-bold">{username}</p>
                            <p className="opacity-70 text-sm">{user.username}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-(--discord-gray-4) rounded-lg p-4 border border-(--discord-gray-1)">
                            <p className="text-xs opacity-60 uppercase">User ID</p>
                            <p className="mt-1 break-all">{user.userId}</p>
                        </div>
                        <div className="bg-(--discord-gray-4) rounded-lg p-4 border border-(--discord-gray-1)">
                            <p className="text-xs opacity-60 uppercase">
                                Auth Provider
                            </p>
                            <p className="mt-1">{user.authProvider}</p>
                        </div>
                        <div className="bg-(--discord-gray-4) rounded-lg p-4 border border-(--discord-gray-1)">
                            <p className="text-xs opacity-60 uppercase">
                                Account Status
                            </p>
                            <p className="mt-1">
                                {user.isEnabled ? "Enabled" : "Disabled"}
                            </p>
                        </div>
                        <div className="bg-(--discord-gray-4) rounded-lg p-4 border border-(--discord-gray-1)">
                            <p className="text-xs opacity-60 uppercase">
                                Member Since
                            </p>
                            <p className="mt-1">{formatDate(user.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
