import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";

import {
  themeQuartz,
  type AutoSizeStrategy,
  type ColDef,
  type GridReadyEvent,
  type SelectionChangedEvent,
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
  editable = false,
  quickFilterText = "",
  getRowId,
  onGridReady,
  onRowClick,
  onSelectionChanged,
  onCellValueChanged,
}: DataGridProps<T>) {
  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      editable,
      minWidth: 130,
      autoHeaderHeight: true,
    }),
    [editable],
  );

  const autoSizeStrategy = useMemo<AutoSizeStrategy>(
    () => ({
      type: "fitCellContents",
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
        domLayout="autoHeight"
        loading={loading}
        quickFilterText={quickFilterText}
        pagination={pagination}
        paginationPageSize={pageSize}
        paginationPageSizeSelector={[10, 20, 50, 100]}
        rowSelection={{
          mode: "multiRow",
          checkboxes: true,
          headerCheckbox: true,
        }}
        getRowId={
          getRowId
            ? (params) => getRowId(params.data)
            : undefined
        }
        onGridReady={(event: GridReadyEvent<T>) => {
          onGridReady?.(event.api);
        }}
        onRowClicked={(event) => {
          if (event.data) {
            onRowClick?.(event.data);
          }
        }}
        onSelectionChanged={(
          event: SelectionChangedEvent<T>,
        ) => {
          onSelectionChanged?.(
            event.api.getSelectedRows(),
          );
        }}
        onCellValueChanged={(event) => {
          if (event.data) {
            onCellValueChanged?.(
              event.data,
              event.colDef.field as string | undefined,
              event,
            );
          }
        }}
      />
    </div>
  );
}