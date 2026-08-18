import type { ColDef } from "ag-grid-community";
import RelationPage from "../../components/common/relation-page/RelationPage";
import type {
  Session,
  SessionInput,
} from "../../types/formation";
import { sessionApi } from "../../services/formations";

const sessionFields: ColDef<Session>[] = [
  { field: "session_id", headerName: "Session ID", editable: false },
  { field: "session_datetime", headerName: "Date and Time", minWidth: 190 },
  { field: "address", headerName: "Address", minWidth: 220 },
  {
    field: "session_type",
    headerName: "Type",
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Training", "Game"] },
  },
];

const toSession = (row: Session): SessionInput => ({
  session_datetime: row.session_datetime.replace("T", " "),
  address: row.address.trim(),
  session_type: row.session_type,
});

export default function Session() {
  return (
        <RelationPage<Session, SessionInput, Partial<SessionInput>>
        title="Sessions"
        description="Create the game or training session first."
        columnDefs={sessionFields}
        api={sessionApi}
        idField="session_id"
        getRowId={(row) => String(row.session_id)}
        createEmptyRow={() => ({
            session_id: -Date.now(),
            session_datetime: new Date().toISOString().slice(0, 16).replace("T", " "),
            address: "",
            session_type: "Training",
        })}
        validateRow={(row) => [
            !row.session_datetime ? "Session date/time is required." : "",
            !row.address.trim() ? "Address is required." : "",
        ].filter(Boolean)}
        toCreateInput={toSession}
        toUpdateInput={toSession}
        />
  );
}
