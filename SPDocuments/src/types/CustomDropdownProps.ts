import { DocumentItem } from "./DocumentTypes";

export type CustomDropdownProps = {
    index: number;
    item: DocumentItem;
    type: "documentType" | "group";
    options: string[];
    updateValue: (index: number, value: string) => void;
};