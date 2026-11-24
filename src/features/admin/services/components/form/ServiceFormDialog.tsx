"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import ServiceForm from "./ServiceForm";
import type { Service } from "../../services.types";
import type { ServiceFormValues } from "../../services.schema";

interface ServiceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Service | null;
    onSubmit: (values: ServiceFormValues) => Promise<void> | void;
    isSubmitting?: boolean;
}

export default function ServiceFormDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isSubmitting = false,
}: ServiceFormDialogProps) {
    const handleSubmit = async (values: ServiceFormValues) => {
        await onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
                <DialogHeader className="gap-1">
                    <DialogTitle>
                        {initialData ? "Update Service" : "Add New Service"}
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {initialData
                            ? "Update the details of this service."
                            : "Add a service to your portfolio."}
                    </DialogDescription>
                </DialogHeader>

                <ServiceForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
    );
}
