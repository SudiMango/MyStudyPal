"use client";

import {
    BookOpen,
    ChevronDown,
    ChevronUp,
    CircleUser,
    Menu,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    return (
        <header className="bg-(--discord-gray-2) shadow-md flex flex-row px-4 min-h-[65px]">
            {/* Website logo */}
            <Link
                className="inline-flex flex-row w-auto text-xl justify-center items-center text-(--discord-blurple) font-bold"
                href="/"
            >
                <BookOpen className="w-8 h-8 mr-2" />
                MyStudyPal
            </Link>

            {/* Nav bar */}
            <div className="ml-auto hidden sm:flex flex-row justify-center items-center space-x-1">
                <Link
                    href="/"
                    className="hover:bg-(--discord-gray-3) text-lg h-full flex items-center justify-center p-3"
                >
                    Home
                </Link>
                <Link
                    href="/#faq"
                    className="hover:bg-(--discord-gray-3) text-lg h-full flex items-center justify-center p-3"
                    scroll={true}
                >
                    FAQ
                </Link>
                <div className="h-[45px] w-0.5 bg-(--discord-gray-3) mx-3" />

                <div className="relative h-full">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="h-full flex flex-row justify-center items-center space-x-1 hover:bg-(--discord-gray-3) p-3 cursor-pointer"
                    >
                        <CircleUser className="w-8 h-8" />
                        {showDropdown ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    {showDropdown && (
                        <div className="absolute bg-(--discord-gray-2) w-50 right-0 top-20 shadow-xl rounded-lg flex flex-col items-center justify-center">
                            <Link
                                href="/login"
                                className="w-full text-center p-3 text-lg hover:bg-(--discord-gray-1) rounded-lg"
                                onClick={() => setShowDropdown(true)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="w-full text-center p-3 text-lg hover:bg-(--discord-gray-1) rounded-lg"
                                onClick={() => setShowDropdown(true)}
                            >
                                Signup
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile nav */}
            <div className="flex sm:hidden ml-auto justify-center items-center">
                <button onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu className="w-8 h-8" />
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex flex-col sm:hidden items-center bg-(--discord-gray-2)/50 backdrop-blur-md">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-4 ml-auto"
                    >
                        <X className="w-10 h-10" />
                    </button>

                    <div className="flex flex-col text-center items-center justify-center space-y-3 w-full px-6">
                        <Link
                            href="/"
                            className="text-xl p-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/#faq"
                            className="text-xl p-3"
                            scroll={true}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            FAQ
                        </Link>

                        <div className="w-full bg-white/50 h-1 rounded-lg" />

                        <Link
                            href="/login"
                            className="text-xl p-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="text-xl p-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Signup
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
