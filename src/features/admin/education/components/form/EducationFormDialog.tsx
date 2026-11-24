"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import EducationForm from "./EducationForm";
import type { Education } from "../../education.types";
import type { EducationFormValues } from "../../education.schema";

interface EducationFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Education | null;
    onSubmit: (values: EducationFormValues) => Promise<void> | void;
    isSubmitting?: boolean;
}

export default function EducationFormDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isSubmitting = false,
}: EducationFormDialogProps) {
    const handleSubmit = async (values: EducationFormValues) => {
        await onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
                <DialogHeader className="gap-1">
                    <DialogTitle>
                        {initialData ? "Update Education" : "Add New Education"}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {initialData
                            ? "Update the details of your education."
                            : "Add your education to your portfolio."}
                    </DialogDescription>
                </DialogHeader>

                <EducationForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
