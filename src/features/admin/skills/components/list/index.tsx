
"use client";

import { useCallback, useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    DataTable,
    createActionColumn,
} from "@/components/common/DataTable";

import { alert } from "@/components/common/alert";

import type { Skill } from "../../skill.types";
import { useCreateSkillMutation, useDeleteSkillMutation, useUpdateSkillMutation } from "../../hooks/skill.mutations";

import SkillCell from "./cells/SkillCell";
import ProficiencyCell from "./cells/ProficiencyCell";
import StatusCell from "./cells/StatusCell";
import SkillFormDialog from "../form/SkillFormDialog";
import { SkillFormValues } from "../../skill.schema";
import SkillDetailsDialog from "../details/SkillDetailsDialog";
import { formatDate } from "@/lib/utils/date.utils";

interface SkillsListProps {
    skills: Skill[];
    loading: boolean;
}

interface FormModal {
    open: boolean;
    data: Skill | null;
}

export default function SkillsList({
    skills,
    loading,
}: SkillsListProps) {
    const router = useRouter();
    const [formModal, setFormModal] = useState<FormModal>({
        open: false,
        data: null,
    });
    const [detailsModal, setDetailsModal] = useState<FormModal>({
        open: false,
        data: null,
    })

    const { mutateAsync: deleteSkill, isPending: isDeleting } = useDeleteSkillMutation();
    const { mutateAsync: createSkill, isPending: isCreating } = useCreateSkillMutation();
    const { mutateAsync: updateSkill, isPending: isUpdating } = useUpdateSkillMutation();


    const isSubmitting = isCreating || isUpdating;

    // View skill
    const handleView = useCallback((skill: Skill) => {
        setDetailsModal({ open: true, data: skill });
    }, [router]);

    // Delete skill
    const handleDelete = useCallback(
        async (skill: Skill) => {
            const confirmed = await alert.confirm({
                title: "Delete Skill?",
                description: `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`,
                confirmText: "Delete",
                cancelText: "Cancel",
            });

            if (!confirmed) return;

            try {
                await deleteSkill(skill.id);
                toast.success("Skill deleted successfully.");
            } catch (error) {
                console.error("Delete skill failed:", error);
                toast.error("Failed to delete skill.");
            }
        },
        [deleteSkill]
    );

    // Add skill
    const handleAdd = useCallback(() => {
        setFormModal({ open: true, data: null });
    }, [router]);

    // Edit skill
    const handleEdit = useCallback((skill: Skill) => {
        setFormModal({ open: true, data: skill });
    }, [router]);

    // Filter skills
    const handleFilter = useCallback(() => {
        console.log("Open skill filters");
    }, []);

    const handleSubmit = useCallback(async (values: SkillFormValues) => {
        console.log(values);
        try {
            if (formModal.data) {
                await updateSkill({
                    id: formModal.data.id,
                    data: values
                });
                toast.success("Skill updated successfully.");
            } else {
                await createSkill(values);
                toast.success("Skill created successfully.");
            }
            // setFormModal({ open: false, data: null });
        } catch (error) {
            console.error("Create skill failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save skill."
            );

            throw error;
        }
    }, [formModal.data, createSkill, updateSkill])

    // Table columns
    const columns = useMemo<ColDef<Skill>[]>(
        () => [
            {
                headerName: "Skill",
                field: "name",
                minWidth: 220,
                flex: 1,
                cellRenderer: SkillCell,
                autoHeight: true,
            },
            {
                headerName: "Description",
                field: "description",
                minWidth: 200,
                flex: 1,
                tooltip: ({ data }) => data?.description ?? "",
            },
            {
                headerName: "Proficiency",
                field: "proficiency",
                minWidth: 170,
                flex: 1,
                cellRenderer: ProficiencyCell,
                cellClass: "!flex items-center justify-center",
            },
            {
                headerName: "Status",
                field: "isActive",
                minWidth: 120,
                flex: 0.8,
                cellRenderer: StatusCell,
                cellClass: "!flex items-center justify-center",
            },
            {
                headerName: "Order",
                field: "displayOrder",
                minWidth: 90,
                flex: 0.8,
            },
            {
                headerName: "Created Date",
                field: "createdAt",
                minWidth: 150,
                flex: 0.9,
                cellRenderer: ({ value }: ICellRendererParams<Skill, Date | undefined>) => formatDate(value),
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
            <DataTable<Skill>
                title="Skill List"
                columns={columns}
                data={skills}
                toolbar={{
                    addButtonLabel: "Add Skill",
                    searchPlaceholder: "Search skills...",
                    onAdd: handleAdd,
                    onFilterClick: handleFilter,
                }}
                loading={loading}
            />

            <SkillFormDialog
                open={formModal.open}
                onOpenChange={(open) => setFormModal({ open, data: null })}
                initialData={formModal.data}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />

            <SkillDetailsDialog
                open={detailsModal.open}
                onOpenChange={(open) =>
                    setDetailsModal((previous) => ({
                        open,
                        data: open ? previous.data : null,
                    }))
                }
                skill={detailsModal.data}
            />
        </>
    );
}
