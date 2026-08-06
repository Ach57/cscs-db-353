import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

type ReportParam = "location_id" | "start_date" | "end_date";
type CatalogItem = { id:number; status:string; description:string; required_params:ReportParam[] };
type ReportResult = { id:number; status:string; message?:string; rows:Record<string,unknown>[] };
type Health = { status:string; database:string; latency_ms:number };

export default function Reports() {
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [selected, setSelected] = useState(8);
  const [locationId, setLocationId] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [result, setResult] = useState<ReportResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [emailMessage, setEmailMessage] = useState("");

  useEffect(() => {
    api.get<CatalogItem[]>("/reports").then(setCatalog).catch((requestError) => setError(requestError.message));
    api.get<Health>("/health").then(setHealth).catch(() => setHealth(null));
  }, []);

  const selectedReport = catalog.find((item) => item.id === selected);
  const required = selectedReport?.required_params ?? [];
  const needsLocation = required.includes("location_id");
  const needsStart = required.includes("start_date");
  const needsEnd = required.includes("end_date");
  const columns = useMemo(() => result?.rows?.[0] ? Object.keys(result.rows[0]) : [], [result]);

  useEffect(() => {
    if (!needsLocation) setLocationId("");
    if (!needsStart) setStart("");
    if (!needsEnd) setEnd("");
    setResult(null);
    setError("");
  }, [selected, needsLocation, needsStart, needsEnd]);

  async function run() {
    setLoading(true);
    setError("");
    try {
      if (needsLocation && !locationId) throw new Error("Location ID is required for this report.");
      if (needsStart && !start) throw new Error("Start date is required for this report.");
      if (needsEnd && !end) throw new Error("End date is required for this report.");
      if (needsStart && needsEnd && start > end) throw new Error("Start date must be on or before end date.");

      const query = new URLSearchParams();
      if (needsLocation) query.set("location_id", locationId);
      if (needsStart) query.set("start_date", start);
      if (needsEnd) query.set("end_date", end);
      setResult(await api.get<ReportResult>(`/reports/${selected}${query.size ? `?${query}` : ""}`));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Report failed.");
    } finally {
      setLoading(false);
    }
  }

  async function emails() {
    setEmailMessage("");
    setError("");
    try {
      const data = await api.post<{ generated_count:number }>("/email-logs/generate-weekly", {
        from_date: new Date().toISOString().slice(0, 10),
        persist: true,
      });
      setEmailMessage(`${data.generated_count} weekly email record(s) generated and logged.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Email generation failed.");
    }
  }

  return <section className="report-page">
    <header className="report-header">
      <div><h1>Project Reports & Demo Tools</h1><p>Run Q8–Q19, verify the AITS connection, and demonstrate weekly email generation.</p></div>
      <div className={`health ${health ? "health--ok" : "health--bad"}`}>{health ? `Database connected · ${health.latency_ms} ms` : "Database unavailable"}</div>
    </header>
    <div className="report-controls">
      <label>Query<select value={selected} onChange={(event) => setSelected(Number(event.target.value))}>{catalog.map((item) => <option key={item.id} value={item.id}>Q{item.id} · {item.status}</option>)}</select></label>
      <label className={!needsLocation ? "report-control--disabled" : ""}>Location ID<input value={locationId} onChange={(event) => setLocationId(event.target.value)} inputMode="numeric" disabled={!needsLocation} placeholder={needsLocation ? "Required" : "Not used"} /></label>
      <label className={!needsStart ? "report-control--disabled" : ""}>Start date<input type="date" value={start} onChange={(event) => setStart(event.target.value)} disabled={!needsStart} /></label>
      <label className={!needsEnd ? "report-control--disabled" : ""}>End date<input type="date" value={end} onChange={(event) => setEnd(event.target.value)} disabled={!needsEnd} /></label>
      <button className="button button--primary" onClick={() => void run()} disabled={loading}>{loading ? "Running..." : "Run report"}</button>
      <button className="button" onClick={() => void emails()}>Generate weekly emails</button>
    </div>
    <p className="report-parameter-help">Required inputs: {required.length ? required.map((param) => param.replace("_", " ")).join(", ") : "none"}.</p>
    {selectedReport && <p className="report-description">{selectedReport.description}</p>}
    {error && <p role="alert" className="relation-page__status relation-page__status--error">{error}</p>}
    {emailMessage && <p className="relation-page__status">{emailMessage}</p>}
    {result?.message && <p className="report-warning">{result.message}</p>}
    {result && <div className="report-results"><h2>Q{result.id} Results <span>{result.rows.length} row(s)</span></h2>{result.rows.length ? <div className="report-table-wrap"><table><thead><tr>{columns.map((column) => <th key={column}>{column.replaceAll("_", " ")}</th>)}</tr></thead><tbody>{result.rows.map((row, index) => <tr key={index}>{columns.map((column) => <td key={column}>{row[column] == null ? "—" : String(row[column])}</td>)}</tr>)}</tbody></table></div> : <p>No rows returned.</p>}</div>}
  </section>;
}
