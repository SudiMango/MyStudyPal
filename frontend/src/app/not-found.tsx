import React from "react";
import Link from "next/link";
import Header from "./components/global/Header";
import Footer from "./components/global/Footer";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />

            <main className="flex grow flex-col items-center justify-center text-center px-6">
                {/* Large 404 Number */}
                <h1 className="text-8xl md:text-9xl font-black text-(--discord-blurple) mb-4">
                    404
                </h1>

                {/* Messaging */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-400 mb-10">
                    The link you followed may be broken, or the page may have
                    been removed.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="px-8 py-3 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) text-white font-bold rounded-lg transition-all active:scale-95"
                    >
                        Back to Home
                    </Link>
                    <span>or</span>
                    <Link
                        href="/app/study-sets"
                        className="px-8 py-3 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) text-white font-bold rounded-lg transition-all active:scale-95"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NotFoundPage;
