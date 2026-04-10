import { Pen, Trash } from "lucide-react";
import React from "react";

interface SettingsDropdownProps {
    isOpen: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onClose?: () => void;
    showEdit?: boolean;
    showDelete?: boolean;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
    isOpen,
    onEdit,
    onDelete,
    onClose,
    showEdit = true,
    showDelete = true,
}) => {
    if (!isOpen) return null;

    const handleButtonClick = (callback?: () => void) => {
        callback?.();
        onClose?.();
    };

    return (
        <div className="absolute right-0 top-8 bg-(--discord-gray-2) rounded-lg shadow-xl border border-(--discord-gray-1) p-2 w-35 z-50">
            <button
                hidden={!showEdit}
                onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick(onEdit);
                }}
                className="w-full text-left px-3 py-2 hover:bg-(--discord-gray-3) rounded flex items-center gap-2 text-sm"
            >
                <Pen className="w-4 h-4" />
                <label>Edit</label>
            </button>
            <button
                hidden={!showDelete}
                onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick(onDelete);
                }}
                className="w-full text-left px-3 py-2 hover:bg-(--discord-gray-3) rounded flex items-center gap-2 text-red-400 text-sm"
            >
                <Trash className="w-4 h-4" />
                <label>Delete</label>
            </button>
        </div>
    );
};

export default SettingsDropdown;
