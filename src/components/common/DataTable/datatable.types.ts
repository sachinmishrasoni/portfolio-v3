import type { ColDef } from "ag-grid-community";

export interface DataTableToolbarProps {
    addButtonLabel?: string;
    searchPlaceholder?: string;
    showSearch?: boolean;
    showFilter?: boolean;
    showAddButton?: boolean;

    onAdd?: () => void;
    onFilterClick?: () => void;
}

export interface DataTableProps<TData> {
    title: string;
    columns: ColDef<TData>[];
    data: TData[];

    toolbar?: DataTableToolbarProps;

    pageSize?: number;
    pageSizeOptions?: number[];

    loading?: boolean;
    className?: string;
}