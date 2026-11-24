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

import type { CreateServiceInput, Service } from "../../services.types";
import type { ServiceFormValues } from "../../services.schema";
import {
    useCreateServiceMutation,
    useDeleteServiceMutation,
    useUpdateServiceMutation,
} from "../../hooks/services.mutations";
import ServiceFormDialog from "../form/ServiceFormDialog";
import ServiceDetailsDialog from "../details/ServiceDetailsDialog";
import ServiceCell from "./cells/ServiceCell";
import StatusCell from "./cells/StatusCell";

interface ServiceListProps {
    services: Service[];
    loading: boolean;
}

interface ModalState {
    open: boolean;
    data: Service | null;
}

export default function ServiceList({
    services,
    loading,
}: ServiceListProps) {
    const [formModal, setFormModal] = useState<ModalState>({
        open: false,
        data: null,
    });
    const [detailsModal, setDetailsModal] = useState<ModalState>({
        open: false,
        data: null,
    });

    const { mutateAsync: deleteService, isPending: isDeleting } =
        useDeleteServiceMutation();
    const { mutateAsync: createService, isPending: isCreating } =
        useCreateServiceMutation();
    const { mutateAsync: updateService, isPending: isUpdating } =
        useUpdateServiceMutation();

    const isSubmitting = isCreating || isUpdating;

    const handleView = useCallback((service: Service) => {
        setDetailsModal({ open: true, data: service });
    }, []);

    const handleDelete = useCallback(async (service: Service) => {
        const confirmed = await alert.confirm({
            title: "Delete Service?",
            description: `Are you sure you want to delete "${service.title}"? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        if (!confirmed) return;
        try {
            await deleteService(service.id);
            toast.success("Service deleted successfully.");
        } catch (error) {
            console.error("Delete service failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to delete service."
            );
        }
    }, [deleteService]);

    const handleAdd = useCallback(() => {
        setFormModal({ open: true, data: null });
    }, []);

    const handleEdit = useCallback((service: Service) => {
        setFormModal({ open: true, data: service });
    }, []);

    const handleFilter = useCallback(() => {
        console.log("Open service filters");
    }, []);

    const handleSubmit = useCallback(async (values: ServiceFormValues) => {
        try {
            const payload: CreateServiceInput = { ...values };
            if (formModal.data) {
                await updateService({
                    serviceId: formModal.data.id,
                    payload,
                });
                toast.success("Service updated successfully.");
            } else {
                await createService(payload);
                toast.success("Service created successfully.");
            }
        } catch (error) {
            console.error("Save service failed:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to save service."
            );
            throw error;
        }
    }, [formModal.data, createService, updateService]);

    const columns = useMemo<ColDef<Service>[]>(
        () => [
            {
                headerName: "Service",
                field: "title",
                minWidth: 280,
                flex: 1,
                cellRenderer: ServiceCell,
                autoHeight: true,
            },
            {
                headerName: "Slug",
                field: "slug",
                minWidth: 180,
                flex: 1,
            },
            {
                headerName: "Featured",
                field: "isFeatured",
                minWidth: 110,
                cellRenderer: ({ value }: ICellRendererParams<Service>) =>
                    value ? "Yes" : "No",
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
                }: ICellRendererParams<Service, Date | undefined>) =>
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
            <DataTable<Service>
                title="Service List"
                columns={columns}
                data={services}
                toolbar={{
                    addButtonLabel: "Add Service",
                    searchPlaceholder: "Search services...",
                    onAdd: handleAdd,
                    onFilterClick: handleFilter,
                }}
                loading={loading || isDeleting}
            />

            <ServiceFormDialog
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

            <ServiceDetailsDialog
                open={detailsModal.open}
                onOpenChange={(open) =>
                    setDetailsModal((previous) => ({
                        open,
                        data: open ? previous.data : null,
                    }))
                }
                service={detailsModal.data}
            />
        </>
    );
}
