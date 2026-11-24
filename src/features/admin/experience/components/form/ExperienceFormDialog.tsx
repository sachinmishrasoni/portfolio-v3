
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import ExperienceForm from "./ExperienceForm";

import type { Experience } from "../../experience.types";
import type { ExperienceFormValues } from "../../experience.schema";

interface ExperienceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Experience | null;
    onSubmit: (values: ExperienceFormValues) => Promise<void> | void;
    isSubmitting?: boolean;
}

const ExperienceFormDialog = ({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isSubmitting = false,
}: ExperienceFormDialogProps) => {
    const handleSubmit = async (values: ExperienceFormValues) => {
        await onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
                <DialogHeader className="gap-1">
                    <DialogTitle>
                        {initialData ? "Update Experience" : "Add New Experience"}
                    </DialogTitle>

                    <DialogDescription className="text-xs">
                        {initialData
                            ? "Update the details of your professional experience."
                            : "Add your professional experience to your portfolio."}
                    </DialogDescription>
                </DialogHeader>

                <ExperienceForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ExperienceFormDialog;
