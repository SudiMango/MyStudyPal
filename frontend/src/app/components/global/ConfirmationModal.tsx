import React from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
    confirmMessage: string;
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    message,
    confirmMessage,
    isLoading = false,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5">
            <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-md w-full">
                <p className="text-white text-lg mb-4">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 bg-(--discord-gray-1) text-white rounded hover:bg-(--discord-gray-3) disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? confirmMessage : "Yes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
