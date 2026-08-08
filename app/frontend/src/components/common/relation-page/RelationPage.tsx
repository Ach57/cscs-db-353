import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColDef, GridApi } from "ag-grid-community";

import DataGrid from "../data-grid/DataGrid";
import type { CrudApi } from "../../../services/crudApi";
import "./RelationshipPage.css";

interface RelationPageProps<T extends object, CreateInput = Partial<T>, UpdateInput = Partial<T>> {
  title: string;
  description: string;
  initialData?: T[];
  columnDefs: ColDef<T>[];
  getRowId: (row: T) => string;
  idField: keyof T;
  api: CrudApi<T, CreateInput, UpdateInput>;
  createEmptyRow?: () => T;
  validateRow?: (row: T) => string[];
  toCreateInput?: (row: T) => CreateInput;
  toUpdateInput?: (row: T) => UpdateInput;
}

export default function RelationPage<
  T extends object,
  CreateInput = Partial<T>,
  UpdateInput = Partial<T>,
>({
  title,
  description,
  initialData = [],
  columnDefs,
  getRowId,
  idField,
  api,
  createEmptyRow,
  validateRow,
  toCreateInput,
  toUpdateInput,
}: RelationPageProps<T, CreateInput, UpdateInput>) {
  const [rows, setRows] = useState<T[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [searchText, setSearchText] = useState("");
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());
  const [dirtyRowIds, setDirtyRowIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gridApiRef = useRef<GridApi<T> | null>(null);

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAll();
      setRows(data);
      setSelectedRows([]);
      setNewRowIds(new Set());
      setDirtyRowIds(new Set());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load records.");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

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
    if (!createEmptyRow) return;
    const newRow = createEmptyRow();
    const rowId = getRowId(newRow);
    setRows((currentRows) => [...currentRows, newRow]);
    setNewRowIds((current) => new Set(current).add(rowId));
    setDirtyRowIds((current) => new Set(current).add(rowId));
    setMessage("New row added. Fill it in, then click Save changes.");
  }

  async function handleDeleteSelected() {
    const selectedIds = new Set(selectedRows.map(getRowId));
    if (selectedIds.size === 0) return;

    if (!window.confirm(`Delete ${selectedIds.size} selected record${selectedIds.size === 1 ? "" : "s"}?`)) {
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await Promise.all(
        selectedRows
          .filter((row) => !newRowIds.has(getRowId(row)))
          .map((row) => api.remove(getRowId(row))),
      );

      setRows((currentRows) => currentRows.filter((row) => !selectedIds.has(getRowId(row))));
      setNewRowIds((current) => new Set([...current].filter((id) => !selectedIds.has(id))));
      setDirtyRowIds((current) => new Set([...current].filter((id) => !selectedIds.has(id))));
      setSelectedRows([]);
      setMessage(`${selectedIds.size} record${selectedIds.size === 1 ? "" : "s"} deleted.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete records.");
    } finally {
      setSaving(false);
    }
  }

  function handleCellValueChanged(updatedRow: T) {
    const updatedId = getRowId(updatedRow);
    setRows((currentRows) =>
      currentRows.map((row) => (getRowId(row) === updatedId ? { ...updatedRow } : row)),
    );
    setDirtyRowIds((current) => new Set(current).add(updatedId));
    setMessage(null);
    setError(null);
  }

  async function handleSave() {
    if (dirtyRowIds.size === 0) return;

    gridApiRef.current?.stopEditing();
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const changedRows = rows.filter((row) => dirtyRowIds.has(getRowId(row)));

      for (const row of changedRows) {
        const validationErrors = validateRow?.(row) ?? [];
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(" "));
        }
      }

      await Promise.all(
        changedRows.map((row) => {
          const rowId = getRowId(row);
          if (newRowIds.has(rowId)) {
            if (toCreateInput) return api.create(toCreateInput(row));
            const { [idField]: _temporaryId, ...createPayload } = row;
            return api.create(createPayload as CreateInput);
          }

          const updatePayload = toUpdateInput ? toUpdateInput(row) : (row as unknown as UpdateInput);
          return api.update(rowId, updatePayload);
        }),
      );

      await loadRows();
      setMessage(`${changedRows.length} record${changedRows.length === 1 ? "" : "s"} saved.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="relation-page">
      <div className="relation-page__tools">
        <header className="relation-page__header">
          <div className="relation-page__title">
            <h1 style={{textAlign: "left"}}>{title}</h1>
            <p style={{textAlign: "left"}}>{description}</p>
          </div>
          <div className="relation-page__count">{rows.length} record{rows.length === 1 ? "" : "s"}</div>
        </header>

        <div className="relation-page__toolbar">
          <input
            className="relation-page__search"
            type="search"
            value={searchText}
            placeholder={`Search ${title.toLowerCase()}...`}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <div className="relation-page__actions">
            {createEmptyRow && (
              <button type="button" className="button button--primary" onClick={handleAdd} disabled={saving}>
                Add record
              </button>
            )}
            <button
              type="button"
              className="button button--primary"
              onClick={() => void handleSave()}
              disabled={dirtyRowIds.size === 0 || saving}
            >
              {saving ? "Saving..." : `Save changes${dirtyRowIds.size ? ` (${dirtyRowIds.size})` : ""}`}
            </button>
            <button
              type="button"
              className="button button--danger"
              disabled={selectedRows.length === 0 || saving}
              onClick={() => void handleDeleteSelected()}
            >
              Delete selected
            </button>
          </div>
        </div>

        {error && <p role="alert" className="relation-page__status relation-page__status--error">{error}</p>}
        {message && <p className="relation-page__status">{message}</p>}
      </div>

      <DataGrid<T>
        rowData={rows}
        columnDefs={displayedColumns}
        quickFilterText={searchText}
        editable
        loading={loading}
        pagination={rows.length > 20}
        pageSize={20}
        getRowId={getRowId}
        onGridReady={(apiInstance) => { gridApiRef.current = apiInstance; }}
        onSelectionChanged={setSelectedRows}
        onCellValueChanged={handleCellValueChanged}
      />
    </section>
  );
}
