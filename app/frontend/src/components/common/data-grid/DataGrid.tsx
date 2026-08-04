import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import {
  themeQuartz,
  type AutoSizeStrategy,
  type ColDef,
} from "ag-grid-community";

import type { DataGridProps } from "./gridTypes";
import "./DataGrid.css";

const gridTheme = themeQuartz.withParams({
  headerBackgroundColor: "#142238",
  headerTextColor: "#ffffff",
  headerFontWeight: 600,

  backgroundColor: "#ffffff",
  foregroundColor: "#111827",

  borderColor: "#d1d5db",
  rowBorder: true,

  headerHeight: 58,
  rowHeight: 54,
});

export default function DataGrid<T extends object>({
  rowData,
  columnDefs,
  loading = false,
  pagination = false,
  pageSize = 20,
  getRowId,
  onRowClick,
  onCellValueChanged,
}: DataGridProps<T>) {
  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,

      // Do not use flex here because it can shrink columns.
      minWidth: 120,

      // Show the full column heading.
      wrapHeaderText: false,
      autoHeaderHeight: true,
    }),
    [],
  );

  const autoSizeStrategy = useMemo<AutoSizeStrategy>(
    () => ({
      type: "fitCellContents",

      // Extra horizontal space around the longest value.
      colResizeDefault: "shift",
    }),
    [],
  );

  return (
    <div className="data-grid-container">
      <AgGridReact<T>
        theme={gridTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        autoSizeStrategy={autoSizeStrategy}

        // Grid height follows the displayed rows.
        domLayout="autoHeight"

        loading={loading}
        pagination={pagination}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}

        getRowId={
          getRowId
            ? (params) => getRowId(params.data)
            : undefined
        }

        onRowClicked={(event) => {
          if (event.data) {
            onRowClick?.(event.data);
          }
        }}

        onCellValueChanged={(event) => {
          if (event.data) {
            onCellValueChanged?.(
              event.data,
              event.colDef.field as string | undefined,
            );
          }
        }}
      />
    </div>
  );
}