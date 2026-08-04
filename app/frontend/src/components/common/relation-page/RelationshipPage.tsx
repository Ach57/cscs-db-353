import {
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  ColDef,
  GridApi,
} from "ag-grid-community";

import DataGrid from "../data-grid/DataGrid";

interface RelationPageProps<T extends object> {
  title: string;
  description: string;

  initialData: T[];
  columnDefs: ColDef<T>[];

  getRowId: (row: T) => string;

  createEmptyRow?: () => T;
}

export default function RelationPage<T extends object>({
  title,
  description,
  initialData,
  columnDefs,
  getRowId,
  createEmptyRow,
}: RelationPageProps<T>) {
  const [rows, setRows] = useState<T[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [searchText, setSearchText] = useState("");

  const gridApiRef = useRef<GridApi<T> | null>(null);

  const displayedColumns = useMemo<ColDef<T>[]>(
    () => [
      {
        headerName: "",
        width: 50,
        minWidth: 50,
        maxWidth: 50,
        sortable: false,
        filter: false,
        resizable: false,
        editable: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        pinned: "left",
      },
      ...columnDefs,
    ],
    [columnDefs],
  );

  function handleAdd() {
    if (!createEmptyRow) {
      return;
    }

    const newRow = createEmptyRow();
    setRows((currentRows) => [
      ...currentRows,
      newRow,
    ]);
  }

  function handleDeleteSelected() {
    const selectedIds = new Set(
      selectedRows.map(getRowId),
    );

    setRows((currentRows) =>
      currentRows.filter(
        (row) => !selectedIds.has(getRowId(row)),
      ),
    );

    setSelectedRows([]);
  }

  function handleCellValueChanged(updatedRow: T) {
    const updatedId = getRowId(updatedRow);

    setRows((currentRows) =>
      currentRows.map((row) =>
        getRowId(row) === updatedId
          ? { ...updatedRow }
          : row,
      ),
    );
  }

  function handleExport() {
    gridApiRef.current?.exportDataAsCsv({
      fileName: `${title
        .toLowerCase()
        .replaceAll(" ", "-")}.csv`,
    });
  }

  function handleReset() {
    setRows(initialData);
    setSelectedRows([]);
    setSearchText("");
  }

  return (
    <section className="relation-page">
      <header className="relation-page__header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="relation-page__count">
          {rows.length} record
          {rows.length === 1 ? "" : "s"}
        </div>
      </header>

      <div className="relation-page__toolbar">
        <input
          className="relation-page__search"
          type="search"
          value={searchText}
          placeholder={`Search ${title.toLowerCase()}...`}
          onChange={(event) =>
            setSearchText(event.target.value)
          }
        />

        <div className="relation-page__actions">
          {createEmptyRow && (
            <button
              type="button"
              className="button button--primary"
              onClick={handleAdd}
            >
              Add record
            </button>
          )}

          <button
            type="button"
            className="button button--danger"
            disabled={selectedRows.length === 0}
            onClick={handleDeleteSelected}
          >
            Delete selected
          </button>

          <button
            type="button"
            className="button"
            onClick={handleExport}
          >
            Export CSV
          </button>

          <button
            type="button"
            className="button"
            onClick={handleReset}
          >
            Reset data
          </button>
        </div>
      </div>

      <DataGrid<T>
        rowData={rows}
        columnDefs={displayedColumns}
        quickFilterText={searchText}
        editable
        pagination={rows.length > 20}
        pageSize={20}
        getRowId={getRowId}
        onGridReady={(api) => {
          gridApiRef.current = api;
        }}
        onSelectionChanged={setSelectedRows}
        onCellValueChanged={handleCellValueChanged}
      />
    </section>
  );
}