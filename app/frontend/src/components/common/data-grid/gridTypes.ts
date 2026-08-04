import type {
  CellValueChangedEvent,
  ColDef,
  RowClickedEvent,
} from "ag-grid-community";

export interface DataGridProps<T extends object> {
  rowData: T[];
  columnDefs: ColDef<T>[];

  loading?: boolean;
  height?: string | number;
  pagination?: boolean;
  pageSize?: number;

  getRowId?: (row: T) => string;
  onRowClick?: (row: T) => void;
  onCellValueChanged?: (row: T, field?: string) => void;
}

export type GridColumn<T extends object> = ColDef<T>;

export type GridRowClickEvent<T extends object> = RowClickedEvent<T>;

export type GridCellChangeEvent<T extends object> =
  CellValueChangedEvent<T>;