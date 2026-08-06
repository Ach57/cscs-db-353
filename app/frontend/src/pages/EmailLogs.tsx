import { useEffect, useMemo, useState } from "react";
import { generateWeeklyEmails, listEmailLogs, type EmailLog } from "../services/emails";
import "./EmailLogs.css";

export default function EmailLogs() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try { setLogs(await listEmailLogs()); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not load email logs."); }
    finally { setLoading(false); }
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;
    return logs.filter((log) => [log.email_id, log.email_date, log.membership_number, log.formation_id, log.sender_name, log.receiver_email, log.team_name, log.subject, log.body_snippet]
      .some((value) => String(value ?? "").toLowerCase().includes(query)));
  }, [logs, search]);

  async function generate() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await generateWeeklyEmails(fromDate, true);
      setMessage(`${result.generated_count} email${result.generated_count === 1 ? "" : "s"} generated and saved to the log.`);
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Email generation failed.");
    } finally { setLoading(false); }
  }

  return <section className="email-page">
    <header className="email-page__header">
      <div><h1>Email Logs</h1><p>Inspect every generated schedule email and demonstrate the weekly email requirement.</p></div>
      <strong>{logs.length} logged email{logs.length === 1 ? "" : "s"}</strong>
    </header>

    <div className="email-page__toolbar">
      <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sender, member, subject or body..." />
      <label>Week starts<input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></label>
      <button className="button button--primary" onClick={() => void generate()} disabled={loading}>{loading ? "Working..." : "Generate weekly emails"}</button>
      <button className="button" onClick={() => void load()} disabled={loading}>Refresh</button>
    </div>

    {error && <p role="alert" className="relation-page__status relation-page__status--error">{error}</p>}
    {message && <p className="relation-page__status">{message}</p>}

    <div className="email-table-wrap">
      <table className="email-table">
        <thead><tr><th>ID</th><th>Date</th><th>Sender</th><th>Receiver</th><th>Team / Formation</th><th>Subject</th><th>Body preview</th></tr></thead>
        <tbody>{filtered.map((log) => <tr key={log.email_id}>
          <td>{log.email_id}</td><td>{String(log.email_date).slice(0, 10)}</td><td>{log.sender_name ?? "—"}</td><td><strong>{[log.receiver_first_name, log.receiver_last_name].filter(Boolean).join(" ") || `Member ${log.membership_number}`}</strong><br />{log.receiver_email ?? "—"}</td><td>{log.team_name ?? "—"}<br />Formation #{log.formation_id}</td><td>{log.subject}</td><td className="email-table__body">{log.body_snippet}</td>
        </tr>)}</tbody>
      </table>
      {!loading && filtered.length === 0 && <p className="email-page__empty">No email logs found.</p>}
    </div>
  </section>;
}
