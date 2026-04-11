import React, { useEffect, useRef, useState } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { FieldConfig } from "@/lib/types/modal";

export interface AbstractModalProps {
    isOpen: boolean;
    title: string;
    onConfirm: (values: Record<string, string>) => void;
    onCancel: () => void;
    isLoading: boolean;
    confirmLabel: string;
    confirmLoadingLabel: string;
    confirmDisabled?: boolean;
    children?: React.ReactNode;
    fields?: FieldConfig[];
    initialValues?: Record<string, string>;
}

const AbstractModal: React.FC<AbstractModalProps> = ({
    isOpen,
    title,
    fields = [],
    initialValues = {},
    onConfirm,
    onCancel,
    isLoading,
    confirmLabel,
    confirmLoadingLabel,
    confirmDisabled,
    children,
}) => {
    const [values, setValues] = useState<Record<string, string>>(initialValues);
    const [emojiPickerKey, setEmojiPickerKey] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const prevIsOpen = useRef(false);

    useEffect(() => {
        if (isOpen && !prevIsOpen.current) {
            setValues(initialValues);
            setEmojiPickerKey(null);
        }
        prevIsOpen.current = isOpen;
    }, [isOpen, initialValues]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                onCancel();
            }
        };
        if (isOpen && !isLoading) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, isLoading, onCancel]);

    if (!isOpen) return null;

    const isFieldsValid = fields
        .filter((f) => f.required)
        .every((f) => values[f.key]?.trim());

    const isConfirmDisabled = isLoading || confirmDisabled || !isFieldsValid;

    const set = (key: string, val: string) =>
        setValues((prev) => ({ ...prev, [key]: val }));

    const rows = fields.reduce<FieldConfig[][]>((acc, field) => {
        const existing = acc.find(
            (r) => r[0].row !== undefined && r[0].row === field.row,
        );
        if (existing) existing.push(field);
        else acc.push([field]);
        return acc;
    }, []);

    const renderField = (field: FieldConfig) => {
        const value = values[field.key] ?? "";
        const flexClass =
            field.width ?? (field.flex === 0 ? "flex-none" : "flex-1");
        const charCount = field.showCharCount && field.maxLength && (
            <label className="text-xs opacity-60 ml-auto">
                {value.length}/{field.maxLength}
            </label>
        );

        if (field.type === "emoji") {
            return (
                <div
                    key={field.key}
                    className={`flex flex-col ${field.width ?? "w-12"}`}
                >
                    {field.label && (
                        <label className="text-sm font-semibold mb-1">
                            {field.label}
                        </label>
                    )}
                    <div className="relative bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg flex items-center justify-center h-10">
                        <button
                            type="button"
                            onClick={() =>
                                setEmojiPickerKey(
                                    emojiPickerKey === field.key
                                        ? null
                                        : field.key,
                                )
                            }
                            className="text-2xl hover:opacity-80 transition-opacity w-full h-full flex items-center justify-center"
                        >
                            {value}
                        </button>
                        {emojiPickerKey === field.key && (
                            <div className="absolute top-12 left-0 z-50">
                                <EmojiPicker
                                    width={320}
                                    height={400}
                                    onEmojiClick={(obj) => {
                                        set(field.key, obj.emoji);
                                        setEmojiPickerKey(null);
                                    }}
                                    theme={Theme.DARK}
                                />
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div key={field.key} className={`flex flex-col ${flexClass}`}>
                <div className="flex flex-row items-baseline">
                    {field.label && (
                        <label className="text-sm font-semibold mb-1">
                            {field.label}
                        </label>
                    )}
                    {charCount}
                </div>
                {field.type === "textarea" ? (
                    <textarea
                        value={value}
                        maxLength={field.maxLength}
                        rows={field.rows ?? 3}
                        placeholder={field.placeholder}
                        onChange={(e) => set(field.key, e.target.value)}
                        className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white resize-none"
                    />
                ) : field.type === "number" ? (
                    <input
                        type="number"
                        value={value}
                        min={field.min}
                        max={field.max}
                        placeholder={field.placeholder}
                        onChange={(e) => set(field.key, e.target.value)}
                        className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        onChange={(e) => set(field.key, e.target.value)}
                        className="w-full px-4 py-2 bg-(--discord-gray-1) border border-(--discord-gray-2) rounded-lg focus:outline-none focus:ring-2 focus:ring-(--discord-blurple) text-white"
                    />
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-5 overflow-auto backdrop-blur-sm">
            <div
                ref={modalRef}
                className="bg-(--discord-gray-2) p-6 rounded-lg shadow-xl max-w-md w-full"
            >
                <h2 className="text-white text-xl font-bold mb-4">{title}</h2>
                <div className="space-y-4">
                    {children}
                    {rows.map((rowFields, i) => (
                        <div key={i} className="flex flex-row gap-2">
                            {rowFields.map(renderField)}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-5 py-2 text-sm font-medium text-white hover:underline disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => !isConfirmDisabled && onConfirm(values)}
                        disabled={isConfirmDisabled}
                        className="px-6 py-2 bg-(--discord-blurple) hover:bg-(--discord-blurple-hover) text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? `${confirmLoadingLabel}` : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AbstractModal;
