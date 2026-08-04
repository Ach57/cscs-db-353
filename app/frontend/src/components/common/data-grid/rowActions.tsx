import type {
  ICellRendererParams,
  RowNode,
} from "ag-grid-community";

export interface RowActionsContext<T extends object> {
  editingRowId: string | null;
  getRowId: (row: T) => string;

  startEdit: (node: RowNode<T>) => void;
  saveEdit: (node: RowNode<T>) => void;
  cancelEdit: (node: RowNode<T>) => void;
  deleteRow: (row: T) => void;
}

export default function RowActions<T extends object>(
  params: ICellRendererParams<T>,
) {
  const row = params.data;
  const node = params.node as RowNode<T>;
  const context =
    params.context as RowActionsContext<T>;

  if (!row) {
    return null;
  }

  const rowId = context.getRowId(row);
  const isEditing =
    context.editingRowId === rowId;

  return (
    <div className="row-actions">
      {isEditing ? (
        <>
          <button
            type="button"
            className="row-action row-action--save"
            onClick={() => context.saveEdit(node)}
          >
            Save
          </button>

          <button
            type="button"
            className="row-action"
            onClick={() => context.cancelEdit(node)}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="row-action"
            onClick={() => context.startEdit(node)}
          >
            Edit
          </button>

          <button
            type="button"
            className="row-action row-action--delete"
            onClick={() => context.deleteRow(row)}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}