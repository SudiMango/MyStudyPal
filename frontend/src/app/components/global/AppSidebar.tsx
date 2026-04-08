"use client";
import {
    ArrowLeftFromLine,
    ArrowRightFromLine,
    BookOpen,
    NotebookText,
    BarChart3,
    User,
    Settings,
    LogOut,
    ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";

const links = [
    { name: "Study sets", href: "/app/study-sets", icon: NotebookText },
    { name: "Statistics", href: "/app/statistics", icon: BarChart3 },
];

const AppSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth(); // adjust based on your AuthContext shape
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const username = user?.username?.split("@")[0] ?? "user";

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target as Node)
            ) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showUserMenu]);

    return (
        <aside
            className={`h-screen sticky top-0 hidden md:flex flex-col bg-(--discord-gray-4) group ${
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
                        href="/app/study-sets"
                    >
                        <BookOpen className="w-8 h-8 mr-2 shrink-0" />
                        <span>MyStudyPal</span>
                    </Link>
                )}
                {collapsed && (
                    <Link
                        className="inline-flex flex-row w-auto text-xl text-(--discord-blurple) font-bold py-2 px-1 justify-center items-center group-hover:hidden"
                        href="/app/study-sets"
                    >
                        <BookOpen className="w-8 h-8 shrink-0" />
                    </Link>
                )}
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

            {/* Nav links */}
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

            {/* User card - pinned to bottom */}
            <div className="mt-auto p-2" ref={userMenuRef}>
                {/* Popup menu */}
                {showUserMenu && (
                    <div className="bg-(--discord-gray-2) rounded-xl shadow-xl mb-2 overflow-hidden">
                        <button
                            onClick={() => {
                                router.push("/app/profile");
                                setShowUserMenu(false);
                            }}
                            className="flex flex-row items-center space-x-3 w-full px-4 py-3 hover:bg-(--discord-gray-3) transition-colors"
                        >
                            <User className="w-4 h-4 opacity-70" />
                            {!collapsed && (
                                <span className="text-sm">Profile</span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                router.push("/app/settings");
                                setShowUserMenu(false);
                            }}
                            className="flex flex-row items-center space-x-3 w-full px-4 py-3 hover:bg-(--discord-gray-3) transition-colors"
                        >
                            <Settings className="w-4 h-4 opacity-70" />
                            {!collapsed && (
                                <span className="text-sm">Settings</span>
                            )}
                        </button>

                        <div className="h-px bg-(--discord-gray-3) mx-2" />

                        <button
                            onClick={() => {
                                logout();
                                setShowUserMenu(false);
                            }}
                            className="flex flex-row items-center space-x-3 w-full px-4 py-3 hover:bg-(--discord-gray-3) transition-colors text-red-400"
                        >
                            <LogOut className="w-4 h-4" />
                            {!collapsed && (
                                <span className="text-sm">Log out</span>
                            )}
                        </button>
                    </div>
                )}

                {/* User card button */}
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex flex-row items-center w-full p-3 rounded-xl bg-(--discord-gray-3) hover:bg-(--discord-gray-2) transition-colors cursor-pointer ${
                        collapsed ? "justify-center" : ""
                    }`}
                >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-(--discord-blurple) flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">
                            {username[0]?.toUpperCase()}
                        </span>
                    </div>

                    {!collapsed && (
                        <>
                            <span className="ml-3 text-sm font-medium truncate flex-1 text-left">
                                {username}
                            </span>
                            <ChevronUp
                                className={`w-4 h-4 opacity-50 shrink-0 transition-transform ${
                                    showUserMenu ? "" : "rotate-180"
                                }`}
                            />
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};

export default AppSidebar;
