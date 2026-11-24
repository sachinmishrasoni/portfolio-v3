"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { toast } from "sonner";

import {
    DataTable,
    createActionColumn,
} from "@/components/common/DataTable";
import { alert } from "@/components/common/alert";
import { formatDate } from "@/lib/utils/date.utils";

import type { CreateEducationInput, Education } from "../../education.types";
import type { EducationFormValues } from "../../education.schema";
import {
    useCreateEducationMutation,
    useDeleteEducationMutation,
    useUpdateEducationMutation,
} from "../../hooks/education.mutations";

import EducationFormDialog from "../form/EducationFormDialog";
import EducationDetailsDialog from "../details/EducationDetailsDialog";
import InstitutionCell from "./cells/InstitutionCell";
import LevelCell from "./cells/LevelCell";
import DurationCell from "./cells/DurationCell";
import StatusCell from "./cells/StatusCell";

interface EducationListProps {
    educations: Education[];
    loading: boolean;
}

interface ModalState {
    open: boolean;
    data: Education | null;
}

export default function EducationList({
    educations,
    loading,
}: EducationListProps) {
    const [formModal, setFormModal] = useState<ModalState>({
        open: false,
        data: null,
    });
    const [detailsModal, setDetailsModal] = useState<ModalState>({
        open: false,
        data: null,
    });

    const { mutateAsync: deleteEducation, isPending: isDeleting } =
        useDeleteEducationMutation();
    const { mutateAsync: createEducation, isPending: isCreating } =
        useCreateEducationMutation();
    const { mutateAsync: updateEducation, isPending: isUpdating } =
        useUpdateEducationMutation();

    const isSubmitting = isCreating || isUpdating;

    const handleView = useCallback((education: Education) => {
        setDetailsModal({ open: true, data: education });
    }, []);

    const handleDelete = useCallback(async (education: Education) => {
        const confirmed = await alert.confirm({
            title: "Delete Education?",
            description: `Are you sure you want to delete "${education.degree}" from "${education.institution}"? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        if (!confirmed) return;

        try {
            await deleteEducation(education.id);
            toast.success("Education deleted successfully.");
        } catch (error) {
            console.error("Delete education failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete education."
            );
        }
    }, [deleteEducation]);

    const handleAdd = useCallback(() => {
        setFormModal({ open: true, data: null });
    }, []);

    const handleEdit = useCallback((education: Education) => {
        setFormModal({ open: true, data: education });
    }, []);

    const handleFilter = useCallback(() => {
        console.log("Open education filters");
    }, []);

    const handleSubmit = useCallback(async (values: EducationFormValues) => {
        try {
            if (!values.startDate) {
                throw new Error("Please select a start date.");
            }
            const payload: CreateEducationInput = {
                ...values,
                startDate: values.startDate,
            };

            if (formModal.data) {
                await updateEducation({
                    educationId: formModal.data.id,
                    payload,
                });
                toast.success("Education updated successfully.");
            } else {
                await createEducation(payload);
                toast.success("Education created successfully.");
            }
        } catch (error) {
            console.error("Save education failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save education."
            );
            throw error;
        }
    }, [formModal.data, createEducation, updateEducation]);

    const columns = useMemo<ColDef<Education>[]>(
        () => [
            {
                headerName: "Institution",
                field: "institution",
                minWidth: 280,
                flex: 1,
                cellRenderer: InstitutionCell,
                autoHeight: true,
            },
            {
                headerName: "Degree",
                field: "degree",
                minWidth: 180,
                flex: 1,
            },
            {
                headerName: "Level",
                field: "educationLevel",
                minWidth: 140,
                cellRenderer: LevelCell,
            },
            {
                headerName: "Field of Study",
                field: "fieldOfStudy",
                minWidth: 180,
                flex: 1,
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
                cellRenderer: ({
                    value,
                }: ICellRendererParams<Education, Date | undefined>) =>
                    formatDate(value),
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
            <DataTable<Education>
                title="Education List"
                columns={columns}
                data={educations}
                toolbar={{
                    addButtonLabel: "Add Education",
                    searchPlaceholder: "Search education...",
                    onAdd: handleAdd,
                    onFilterClick: handleFilter,
                }}
                loading={loading || isDeleting}
            />

            <EducationFormDialog
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

            <EducationDetailsDialog
                open={detailsModal.open}
                onOpenChange={(open) =>
                    setDetailsModal((previous) => ({
                        open,
                        data: open ? previous.data : null,
                    }))
                }
                education={detailsModal.data}
            />
        </>
    );
}
