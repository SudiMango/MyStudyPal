import React, { useEffect, useRef } from "react";
import { Pencil, Trash2, X } from "lucide-react";

export interface SettingsInfo {
    label: string;
    value: string;
}

export interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    info?: SettingsInfo[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    onEdit,
    onDelete,
    info = [],
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-(--discord-gray-2) rounded-lg shadow-xl w-full max-w-sm overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-(--discord-gray-1)">
                    <span className="text-sm font-semibold text-white">
                        Settings
                    </span>
                    <button
                        onClick={onClose}
                        className="text-white/50 hover:text-white/90 transition-colors p-1 rounded"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Info grid */}
                <div className="p-4">
                    {info.length > 0 && (
                        <>
                            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                                Info
                            </p>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {info.map((item) => (
                                    <div
                                        key={item.label}
                                        className="bg-(--discord-gray-1) rounded-lg px-3 py-2"
                                    >
                                        <p className="text-[11px] text-white/40 mb-0.5">
                                            {item.label}
                                        </p>
                                        <p className="text-sm font-medium text-white">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Actions */}
                    <div className="border-t border-(--discord-gray-1) pt-3 flex flex-col gap-2">
                        <button
                            onClick={onEdit}
                            className="w-full flex items-center gap-2.5 px-3 py-2 bg-(--discord-gray-1) hover:bg-(--discord-gray-3) text-white text-sm font-medium rounded-lg transition-colors text-left"
                        >
                            <Pencil size={14} className="opacity-70" />
                            Edit
                        </button>
                        <button
                            onClick={onDelete}
                            className="w-full flex items-center gap-2.5 px-3 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-medium rounded-lg transition-colors text-left"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
