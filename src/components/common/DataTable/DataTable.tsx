
"use client";

import { useEffect, useMemo, useState } from "react";
import type { ColDef, GridApi } from "ag-grid-community";
import {
    AllCommunityModule,
    themeQuartz,
    ValidationModule,
} from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";

import { DataTableToolbar } from "./DataTableToolbar";
import type { DataTableProps } from "./datatable.types";
import Paper from "../Paper";

const modules =
    process.env.NODE_ENV === "development"
        ? [AllCommunityModule, ValidationModule]
        : [AllCommunityModule];

const gridTheme = themeQuartz.withParams({
    backgroundColor: "var(--background)",
    foregroundColor: "var(--foreground)",
    headerBackgroundColor: "var(--muted)",
    headerTextColor: "var(--foreground)",
    borderColor: "var(--border)",
    accentColor: "var(--primary)",
    oddRowBackgroundColor: "var(--background)",
    fontFamily: "var(--font-sans)",
    fontSize: 13,
    spacing: 8,
    selectCellBorder: true,
});

export function DataTable<TData>({
    title,
    columns,
    data,
    toolbar,
    pageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    loading = false,
}: DataTableProps<TData>) {
    const [searchValue, setSearchValue] = useState("");
    const [gridApi, setGridApi] = useState<GridApi<TData> | null>(null);

    // Toolbar defaults
    const {
        addButtonLabel = "Add New",
        searchPlaceholder = "Search...",
        showSearch = true,
        showFilter = false,
        showAddButton = true,
        onAdd,
        onFilterClick,
    } = toolbar ?? {};

    // Default column configuration
    const defaultColDef = useMemo<ColDef<TData>>(() => ({
        flex: 1,
        minWidth: 130,
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    // const loadingRows = useMemo(() => {
    //     return { rowCount: 10 };
    // }, []);

    // Synchronize data and loading state with AG Grid
    useEffect(() => {
        if (!gridApi || gridApi.isDestroyed()) return;

        gridApi.setGridOption("rowData", data ?? []);
        gridApi.setGridOption("loading", Boolean(loading));
    }, [gridApi, data, loading]);

    return (
        <Paper className="space-y-4">
            <DataTableToolbar
                title={title}
                addButtonLabel={addButtonLabel}
                searchPlaceholder={searchPlaceholder}
                searchValue={searchValue}
                showSearch={showSearch}
                showFilter={showFilter}
                showAddButton={showAddButton}
                onSearchChange={setSearchValue}
                onAdd={onAdd}
                onFilterClick={onFilterClick}
            />

            <AgGridProvider modules={modules}>
                <div className="w-full min-h-[250px]">
                    <AgGridReact<TData>
                        theme={gridTheme}
                        columnDefs={columns}
                        rowData={data ?? []}
                        defaultColDef={defaultColDef}
                        quickFilterText={searchValue}
                        suppressCellFocus
                        suppressMovableColumns
                        pagination
                        paginationPageSize={pageSize}
                        paginationPageSizeSelector={pageSizeOptions}
                        // loadingRows={loadingRows}
                        domLayout="autoHeight"
                        onGridReady={(event) => {
                            setGridApi(event.api);
                        }}
                        onGridPreDestroyed={(event) => {
                            setGridApi((current) =>
                                current === event.api ? null : current
                            );
                        }}
                    />
                </div>
            </AgGridProvider>
        </Paper>
    );
}
