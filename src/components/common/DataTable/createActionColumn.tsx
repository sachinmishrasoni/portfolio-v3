
import type { ColDef } from "ag-grid-community";

import DataTableActions from "./DataTableActions";
import type { DataTableActionsProps } from "./DataTableActions";

export interface CreateActionColumnProps<TData>
    extends Omit<DataTableActionsProps<TData>, "data"> {
    pinned?: "left" | "right" | "";
    headerName?: string;
    minWidth?: number;
}

export const createActionColumn = <TData,>({
    pinned = "",
    headerName = "Actions",
    minWidth = 70,
    onView,
    onEdit,
    onDelete,
    showView = true,
    showEdit = true,
    showDelete = true,
}: CreateActionColumnProps<TData>): ColDef<TData> => {

    return {
        headerName,
        colId: "actions",
        // width: 50,
        minWidth: 80,
        maxWidth: 80,
        pinned: pinned || undefined,
        sortable: false,
        filter: false,
        resizable: false,
        suppressHeaderMenuButton: true,
        cellRenderer: DataTableActions,
        cellRendererParams: {
            onView,
            onEdit,
            onDelete,
            showView,
            showEdit,
            showDelete,
        },
        cellClass: "flex items-center justify-center",
    };
};
