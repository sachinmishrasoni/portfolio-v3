
"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { toast } from "sonner";

import {
    DataTable,
    createActionColumn,
} from "@/components/common/DataTable";

import { alert } from "@/components/common/alert";

import type { Experience, CreateExperienceInput } from "../../experience.types";
import type { ExperienceFormValues } from "../../experience.schema";

import {
    useCreateExperienceMutation,
    useDeleteExperienceMutation,
    useUpdateExperienceMutation,
} from "../../hooks/experience.mutations";

import ExperienceFormDialog from "../form/ExperienceFormDialog";
import ExperienceDetailsDialog from "../details/ExperienceDetailsDialog";

import CompanyCell from "./cells/CompanyCell";
import EmploymentTypeCell from "./cells/EmploymentTypeCell";
import WorkModeCell from "./cells/WorkModeCell";
import DurationCell from "./cells/DurationCell";
import StatusCell from "./cells/StatusCell";
import { formatDate } from "@/lib/utils/date.utils";

interface ExperienceListProps {
    experiences: Experience[];
    loading: boolean;
}

interface FormModal {
    open: boolean;
    data: Experience | null;
}

export default function ExperienceList({
    experiences,
    loading,
}: ExperienceListProps) {
    const [formModal, setFormModal] = useState<FormModal>({
        open: false,
        data: null,
    });

    const [detailsModal, setDetailsModal] = useState<FormModal>({
        open: false,
        data: null,
    });

    const { mutateAsync: deleteExperience, isPending: isDeleting } = useDeleteExperienceMutation();
    const { mutateAsync: createExperience, isPending: isCreating } = useCreateExperienceMutation();
    const { mutateAsync: updateExperience, isPending: isUpdating } = useUpdateExperienceMutation();

    const isSubmitting = isCreating || isUpdating;

    // View Experience
    const handleView = useCallback((experience: Experience) => {
        setDetailsModal({ open: true, data: experience });
    }, []);

    // Delete Experience
    const handleDelete = useCallback(
        async (experience: Experience) => {
            const confirmed = await alert.confirm({
                title: "Delete Experience?",
                description: `Are you sure you want to delete "${experience.designation}" at "${experience.company}"? This action cannot be undone.`,
                confirmText: "Delete",
                cancelText: "Cancel",
            });

            if (!confirmed) return;

            try {
                await deleteExperience(experience.id);
                toast.success("Experience deleted successfully.");
            } catch (error) {
                console.error("Delete experience failed:", error);
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to delete experience."
                );
            }
        },
        [deleteExperience]
    );

    // Add Experience
    const handleAdd = useCallback(() => {
        setFormModal({ open: true, data: null });
    }, []);

    // Edit Experience
    const handleEdit = useCallback((experience: Experience) => {
        setFormModal({ open: true, data: experience });
    }, []);

    // Filter Experiences
    const handleFilter = useCallback(() => {
        console.log("Open experience filters");
    }, []);

    // Create / Update Experience
    const handleSubmit = useCallback(
        async (values: ExperienceFormValues) => {
            try {
                if (!values.startDate) {
                    throw new Error("Please select a joining date.");
                }

                const payload: CreateExperienceInput = {
                    ...values,
                    startDate: values.startDate,
                };

                if (formModal.data) {
                    await updateExperience({
                        experienceId: formModal.data.id,
                        payload,
                    });

                    toast.success("Experience updated successfully.");
                } else {
                    await createExperience(payload);
                    toast.success("Experience created successfully.");
                }
            } catch (error) {
                console.error("Save experience failed:", error);

                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to save experience."
                );

                throw error;
            }
        },
        [formModal.data, createExperience, updateExperience]
    );

    // Table Columns
    const columns = useMemo<ColDef<Experience>[]>(
        () => [
            {
                headerName: "Company",
                field: "company",
                minWidth: 280,
                flex: 1,
                cellRenderer: CompanyCell,
                autoHeight: true,
            },
            {
                headerName: "Designation",
                field: "designation",
                minWidth: 180,
                flex: 1,
            },
            {
                headerName: "Employment Type",
                field: "employmentType",
                minWidth: 150,
                cellRenderer: EmploymentTypeCell,
            },
            {
                headerName: "Work Mode",
                field: "workMode",
                minWidth: 130,
                cellRenderer: WorkModeCell,
            },
            {
                headerName: "Duration",
                minWidth: 180,
                flex: 1,
                cellRenderer: DurationCell,
            },
            {
                headerName: "Status",
                field: "isActive",
                minWidth: 110,
                cellRenderer: StatusCell,
                cellClass: "!flex items-center justify-center",
            },
            {
                headerName: "Order",
                field: "displayOrder",
                minWidth: 90,
                flex: 0.7,
            },
            {
                headerName: "Created Date",
                field: "createdAt",
                minWidth: 150,
                cellRenderer: ({ value }: ICellRendererParams<Experience, Date | undefined>) => formatDate(value),
            },
            createActionColumn({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
                showView: true,
                showEdit: true,
                showDelete: true,
            }),
        ],
        [handleView, handleEdit, handleDelete]
    );

    return (
        <>
            <DataTable<Experience>
                title="Experience List"
                columns={columns}
                data={experiences}
                toolbar={{
                    addButtonLabel: "Add Experience",
                    searchPlaceholder: "Search experiences...",
                    onAdd: handleAdd,
                    onFilterClick: handleFilter,
                }}
                loading={loading || isDeleting}
            />

            <ExperienceFormDialog
                open={formModal.open}
                onOpenChange={(open) =>
                    setFormModal({
                        open,
                        data: open ? formModal.data : null,
                    })
                }
                initialData={formModal.data}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />

            <ExperienceDetailsDialog
                open={detailsModal.open}
                onOpenChange={(open) =>
                    setDetailsModal((previous) => ({
                        open,
                        data: open ? previous.data : null,
                    }))
                }
                experience={detailsModal.data}
            />
        </>
    );
}
