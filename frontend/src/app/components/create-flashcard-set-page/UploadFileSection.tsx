import { Upload, X, FileText } from "lucide-react";
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

    const handleRemoveFile = (indexToRemove: number) => {
        const updatedFiles = files.filter(
            (_, index) => index !== indexToRemove,
        );
        onFilesChange(updatedFiles);

        if (updatedFiles.length === 0 && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            const pdfs = droppedFiles.filter(
                (f) => f.type === "application/pdf",
            );
            onFilesChange([...files, ...pdfs]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            onFilesChange([...files, ...newFiles]);
        }
    };

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="relative flex flex-col items-center justify-center bg-(--discord-gray-1) rounded-xl p-5 outline-2 outline-(--discord-blurple) outline-dashed w-full min-h-80"
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
            />

            {files.length > 0 ? (
                <div className="z-10 w-full space-y-2">
                    <p className="text-sm font-bold mb-3">
                        Selected Files ({files.length})
                    </p>
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {files.map((file, idx) => (
                            <div
                                key={`${file.name}-${idx}`}
                                className="flex items-center justify-between bg-(--discord-gray-2) p-3 rounded-lg border border-(--discord-gray-3)"
                            >
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <FileText className="h-5 w-5 shrink-0 text-(--discord-blurple)" />
                                    <div className="truncate">
                                        <p className="text-sm font-medium truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs opacity-60">
                                            {(file.size / 1024 / 1024).toFixed(
                                                2,
                                            )}{" "}
                                            MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(idx)}
                                    className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs opacity-50 mt-4">
                        Click or drag more files to add
                    </p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center pointer-events-none">
                    <Upload className="h-8 w-8 mb-2" />
                    <label>Drag files here or click to browse.</label>
                    <label className="text-sm opacity-70">
                        Supports multiple PDFs.
                    </label>
                </div>
            )}
        </div>
    );
}
