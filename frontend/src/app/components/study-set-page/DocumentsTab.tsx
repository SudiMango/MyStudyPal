"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Document,
    getAllDocumentsForStudySet,
    deleteDocument,
    uploadDocuments,
} from "@/lib/api/document-api";
import { FileText, EllipsisVertical, Plus, Loader, Upload } from "lucide-react";
import ConfirmationModal from "@/app/components/global/ConfirmationModal";
import SettingsDropdown from "@/app/components/global/SettingsDropdown";
import SearchBar from "@/app/components/global/SearchBar";
import UploadFileSection from "@/app/components/create-flashcard-set-page/UploadFileSection";
import { formatDate } from "@/lib/util";

interface DocumentsTabProps {
    studySetId: string;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ studySetId }) => {
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Delete state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    // Upload state
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    /**
     * Fetch documents for this study set
     */
    const fetchDocuments = async () => {
        setIsLoading(true);
        const response = await getAllDocumentsForStudySet(studySetId);
        if (response.data) {
            setDocuments(response.data);
        } else {
            alert(response.error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDocuments();
    }, [studySetId]);

    /**
     * Settings dropdown logic
     */
    const handleDropdownToggle = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setShowDropdown(showDropdown !== index ? index : null);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(null);
            }
        };

        if (showDropdown !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    /**
     * Handle document delete
     */
    const handleDeleteClick = (document: Document) => {
        setDocumentToDelete(document);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (documentToDelete) {
            setIsDeleting(true);
            const response = await deleteDocument(documentToDelete.documentId);
            setIsDeleting(false);

            if (!response.error) {
                fetchDocuments();
            } else {
                alert(response.error);
            }
            setIsDeleteModalOpen(false);
            setDocumentToDelete(null);
            setShowDropdown(null);
        }
    };

    /**
     * Handle document upload
     */
    const handleUploadClick = () => {
        setIsUploadModalOpen(true);
    };

    const handleConfirmUpload = async () => {
        if (files.length === 0) {
            alert("Please select at least one file to upload.");
            return;
        }

        setIsUploading(true);
        const response = await uploadDocuments(studySetId, files);
        setIsUploading(false);

        if (!response.error) {
            fetchDocuments();
            setIsUploadModalOpen(false);
            setFiles([]);
        } else {
            alert(response.error);
        }
    };

    // Filtered documents for search
    const filteredDocuments = useMemo(() => {
        if (!query.trim()) return documents;
        return documents.filter((doc) =>
            doc.title.toLowerCase().includes(query.toLowerCase()),
        );
    }, [query, documents]);

    return (
        <>
            {/* Delete document modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete "${documentToDelete?.title}"?`}
                confirmMessage="Deleting..."
                isLoading={isDeleting}
            />

            {/* Upload document modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto">
                    <div className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-2xl w-full">
                        <h2 className="text-white text-lg mb-4">
                            Upload Documents
                        </h2>

                        <UploadFileSection
                            files={files}
                            onFilesChange={setFiles}
                        />

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => {
                                    setIsUploadModalOpen(false);
                                    setFiles([]);
                                }}
                                disabled={isUploading}
                                className="px-4 py-2 bg-(--discord-gray-1) text-white rounded hover:bg-(--discord-gray-3) disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmUpload}
                                disabled={isUploading || files.length === 0}
                                className="px-4 py-2 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) text-white rounded disabled:opacity-50"
                            >
                                {isUploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search bar and upload button */}
            <div className="flex flex-row w-full mb-5 space-x-3">
                <SearchBar
                    query={query}
                    onQueryChange={setQuery}
                    placeholder="Search documents..."
                />
                <button
                    onClick={handleUploadClick}
                    className="flex flex-row justify-center items-center bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) cursor-pointer rounded-xl w-40 text-white font-medium"
                >
                    <Plus className="mr-1" />
                    Upload
                </button>
            </div>

            <div className="space-y-5 w-full">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader className="w-10 h-10 animate-spin text-gray-400" />
                        <p className="mt-4 text-gray-400">
                            Loading documents...
                        </p>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FileText className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-400 text-lg">
                            {query.trim()
                                ? "No documents match your search"
                                : "No documents yet"}
                        </p>
                        {!query.trim() && (
                            <button
                                onClick={handleUploadClick}
                                className="mt-4 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) px-6 py-2 rounded-lg font-medium"
                            >
                                Upload document
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {filteredDocuments.map((doc, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-start justify-center w-full shadow-xl rounded-xl bg-(--discord-gray-4) p-4 transform transition-transform duration-200 hover:scale-105"
                            >
                                <div className="flex flex-row items-center justify-center space-x-3 w-full">
                                    <FileText className="w-10 h-10 text-(--discord-blurple)" />
                                    <div className="flex flex-col">
                                        <label className="text-md font-semibold">
                                            {doc.title}
                                        </label>
                                        <label className="text-sm opacity-70">
                                            Uploaded {formatDate(doc.createdAt)}
                                        </label>
                                    </div>

                                    <div
                                        className="relative flex justify-center items-center ml-auto"
                                        ref={
                                            showDropdown === i
                                                ? dropdownRef
                                                : null
                                        }
                                    >
                                        <button
                                            onClick={(e) =>
                                                handleDropdownToggle(e, i)
                                            }
                                            className="hover:text-(--discord-blurple)"
                                        >
                                            <EllipsisVertical className="w-5 h-5 opacity-80 mb-1" />
                                        </button>

                                        <SettingsDropdown
                                            isOpen={showDropdown === i}
                                            onClose={() =>
                                                setShowDropdown(null)
                                            }
                                            onEdit={undefined}
                                            onDelete={() =>
                                                handleDeleteClick(doc)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-row space-x-3">
                                    <div className="bg-(--discord-gray-2) py-0.5 px-2 rounded-lg">
                                        <label className="text-sm">
                                            {doc.numChunks} chunks
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}

                <button
                    onClick={handleUploadClick}
                    className="flex flex-row w-full items-center justify-center space-x-3 outline-dashed rounded-lg p-3 outline-2 outline-(--discord-blurple-hover) bg-(--discord-gray-1) hover:bg-(--discord-gray-2)"
                >
                    <Plus className="h-8 w-8 text-(--discord-blurple)" />
                    <label className="text-lg font-medium cursor-pointer">
                        Upload new document
                    </label>
                </button>
            </div>
        </>
    );
};

export default DocumentsTab;
