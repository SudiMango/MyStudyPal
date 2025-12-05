// SearchBar.tsx
"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    query,
    onQueryChange,
    placeholder = "Search sets...",
}: SearchBarProps) {
    const handleClear = () => {
        onQueryChange("");
    };

    return (
        <div className="w-full">
            <div className="relative flex items-center">
                <Search className="absolute left-3 w-5 h-5 opacity-60" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple)"
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
