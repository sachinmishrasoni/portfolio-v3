
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import SkillForm from "./SkillForm";
import type { Skill } from "../../skill.types";
import type { SkillFormValues } from "../../skill.schema";

interface SkillFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Skill | null;
    onSubmit: (values: SkillFormValues) => Promise<void> | void;
    isSubmitting?: boolean;
}

const SkillFormDialog = ({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isSubmitting = false,
}: SkillFormDialogProps) => {
    const handleSubmit = async (values: SkillFormValues) => {
        await onSubmit(values);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]" */}
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader className="gap-1">
                    <DialogTitle>
                        {initialData ? "Update Skill" : "Add New Skill"}
                    </DialogTitle>

                    <DialogDescription className="text-xs">
                        {initialData
                            ? "Update the details of your skill."
                            : "Add a new skill to your portfolio."}
                    </DialogDescription>
                </DialogHeader>

                {/* <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4"> */}
                    <SkillForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        onCancel={() => onOpenChange(false)}
                        isSubmitting={isSubmitting}
                    />
                {/* </div> */}
            </DialogContent>
        </Dialog>
    );
};

export default SkillFormDialog;
