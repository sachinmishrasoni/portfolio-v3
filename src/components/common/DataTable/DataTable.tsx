"use client";

import { useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, themeQuartz } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";

import { DataTableToolbar } from "./DataTableToolbar";
import type { DataTableProps } from "./datatable.types";
import Paper from "../Paper";

const modules = [AllCommunityModule];

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
    className,
}: DataTableProps<TData>) {
    const [searchValue, setSearchValue] = useState("");

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

    const defaultColDef = useMemo<ColDef<TData>>(() => ({
        flex: 1,
        minWidth: 130,
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    const loadingRows = useMemo(() => {
        return { rowCount: 10 };
    }, []);


    return (
        <Paper className="space-y-4">
            {/* <div className={`w-full space-y-4 ${className ?? ""}`}> */}
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
                <div className="h-[512px] w-full">
                    <AgGridReact<TData>
                        theme={gridTheme}
                        rowData={data}
                        columnDefs={columns}
                        defaultColDef={defaultColDef}
                        quickFilterText={searchValue}
                        suppressCellFocus
                        loading={loading}
                        loadingRows={loadingRows}
                        pagination
                        paginationPageSize={pageSize}
                        paginationPageSizeSelector={pageSizeOptions}
                        domLayout="normal"
                        getRowId={(params) => {
                            const row = params.data as
                                | (TData & { id?: string | number })
                                | undefined;

                            return row?.id != null
                                ? String(row.id)
                                : String(params.data);
                        }}
                    />
                </div>
            </AgGridProvider>
            {/* </div> */}
        </Paper>
    );
}
