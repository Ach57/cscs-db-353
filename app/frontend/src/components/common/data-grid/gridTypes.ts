import type {
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";

export interface DataGridProps<T extends object> {
  rowData: T[];
  columnDefs: ColDef<T>[];

  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  editable?: boolean;
  quickFilterText?: string;

  getRowId?: (row: T) => string;

  onGridReady?: (api: GridApi<T>) => void;
  onRowClick?: (row: T) => void;
  onSelectionChanged?: (rows: T[]) => void;
  onCellValueChanged?: (
    row: T,
    field?: string,
    event?: CellValueChangedEvent<T>,
  ) => void;
}