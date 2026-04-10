import React from "react";
import Link from "next/link";
import { Github } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-(--discord-gray-2) shadow-md p-4 flex flex-col sm:flex-row items-center justify-between text-white text-sm">
            <div className="mb-2 sm:mb-0">
                &copy; {currentYear} MyStudyPal. All rights reserved.
            </div>
            <div className="flex space-x-4">
                <Link
                    href="https://github.com/SudiMango/MyStudyPal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-(--discord-blurple)"
                >
                    <Github className="w-5 h-5" />
                </Link>
                <Link
                    href="/legal#privacy"
                    className="hover:text-(--discord-blurple)"
                >
                    Privacy Policy
                </Link>
                <Link href="/legal#terms" className="hover:text-(--discord-blurple)">
                    Terms of Service
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
