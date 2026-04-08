export type FieldType = "text" | "textarea" | "emoji" | "number";

export interface FieldConfig {
    key: string;
    type: FieldType;
    label?: string;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
    required?: boolean;
    showCharCount?: boolean;
    row?: number;
    flex?: number;
    width?: string;
    min?: number;
    max?: number;
}
