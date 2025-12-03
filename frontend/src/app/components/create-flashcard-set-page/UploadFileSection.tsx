import { Upload, X } from "lucide-react";
import React, { useRef } from "react";

interface FileUploadAreaProps {
    files: File[];
    onFilesChange: (files: File[]) => void;
}

export default function UploadFileSection({
    files,
    onFilesChange,
}: FileUploadAreaProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        onFilesChange([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            onFilesChange([droppedFiles[0]]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesChange([e.target.files[0]]);
        }
    };

    return (
        <div
            onDrop={handleDrop}
            className="relative flex flex-col items-center justify-center bg-(--discord-gray-1) rounded-xl p-5 outline-2 outline-(--discord-blurple) outline-dashed w-full h-80"
        >
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {files.length > 0 && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-3 right-3 px-2 py-2 bg-(--discord-gray-2) hover:bg-(--discord-gray-3) rounded-lg text-sm font-semibold"
                >
                    <X />
                </button>
            )}

            {files.length > 0 ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold">{files[0].name}</p>
                    <p className="text-sm opacity-60 mt-1">
                        {(files[0].size / 1024 / 1024).toFixed(2)} MB
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 mb-2" />
                    <label>Drag files here or click to browse.</label>
                    <label className="text-sm opacity-70">
                        Supports pdf only.
                    </label>
                </div>
            )}
        </div>
    );
}
