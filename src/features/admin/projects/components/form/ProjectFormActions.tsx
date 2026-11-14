
"use client";

import { FiLoader, FiSave } from "react-icons/fi";

import { Button } from "@/components/ui/button";

interface ProjectFormActionsProps {
    isSubmitting: boolean;
    isEdit: boolean;
    onCancel?: () => void;
}

const ProjectFormActions = ({
    isSubmitting,
    isEdit,
    onCancel,
}: ProjectFormActionsProps) => {
    return (
        <div className="sticky bottom-0 z-20 flex flex-col-reverse gap-3 border-t border-border bg-background/95 py-4 backdrop-blur sm:flex-row sm:justify-end">

            {onCancel && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            )}

            <Button
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <FiLoader className="mr-2 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <FiSave className="mr-2" />
                        {isEdit ? "Update Project" : "Save Project"}
                    </>
                )}
            </Button>
        </div>
    );
};

export default ProjectFormActions;
