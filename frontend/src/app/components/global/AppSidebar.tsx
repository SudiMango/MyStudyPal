"use client";

import {
    ArrowLeftFromLine,
    ArrowRightFromLine,
    BookOpen,
    NotebookText,
    Clock,
    BarChart3,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Links to different pages in the sidebar
const links = [
    { name: "Flashcard sets", href: "/app/flashcard-sets", icon: NotebookText },
    { name: "Quizzes", href: "/app/quizzes", icon: Clock },
    { name: "Statistics", href: "/app/statistics", icon: BarChart3 },
];

const AppSidebar = () => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <aside
            className={`min-h-screen hidden md:flex flex-col bg-(--discord-gray-4) group ${
                collapsed ? "w-16" : "w-64"
            }`}
        >
            {/* Website logo */}
            <div
                className={`flex flex-row items-center h-15 p-2 ${
                    collapsed ? "justify-center" : ""
                }`}
            >
                {!collapsed && (
                    <Link
                        className="inline-flex flex-row w-auto text-xl text-(--discord-blurple) font-bold mr-auto py-2 px-1 justify-center items-center"
                        href="/app/flashcard-sets"
                    >
                        <BookOpen className="w-8 h-8 mr-2 shrink-0" />
                        <span>MyStudyPal</span>
                    </Link>
                )}
                {collapsed && (
                    <Link
                        className="inline-flex flex-row w-auto text-xl text-(--discord-blurple) font-bold py-2 px-1 justify-center items-center group-hover:hidden"
                        href="/app/flashcard-sets"
                    >
                        <BookOpen className="w-8 h-8 shrink-0" />
                    </Link>
                )}

                {/* Collapse and uncollapse button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`rounded-md bg-(--discord-gray-2) hover:bg-(--discord-gray-1) cursor-pointer p-2 shrink-0 ${
                        collapsed ? "hidden group-hover:flex" : "flex"
                    }`}
                >
                    {collapsed ? (
                        <ArrowRightFromLine className="w-5 h-5" />
                    ) : (
                        <ArrowLeftFromLine className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Display links on sidebar */}
            <nav className="flex flex-col p-2 gap-3">
                {links.map((link) => {
                    const active = pathname.startsWith(link.href);
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-lg flex flex-row items-center ${
                                collapsed ? "justify-center" : ""
                            } ${
                                active
                                    ? "bg-(--discord-gray-2)"
                                    : "hover:bg-(--discord-gray-3)"
                            }`}
                            title={collapsed ? link.name : ""}
                        >
                            <Icon className="w-6 h-6 shrink-0" />
                            {!collapsed && (
                                <span className="ml-3">{link.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default AppSidebar;
