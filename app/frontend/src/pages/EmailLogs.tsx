import { useEffect, useMemo, useState } from "react";
import Button from "../components/common/Button";
import { Field, Input } from "../components/common/Input";
import {
  CardHeader, ContentCard, EmptyState, PageHeader, PageShell, StatusMessage,
  TableContainer, Toolbar, ToolbarActions,
} from "../components/common/page/ManagementPage";
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
    setLoading(true); setError("");
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
    setLoading(true); setError(""); setMessage("");
    try {
      const result = await generateWeeklyEmails(fromDate, true);
      setMessage(`${result.generated_count} email${result.generated_count === 1 ? "" : "s"} generated and saved to the log.`);
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Email generation failed.");
    } finally { setLoading(false); }
  }

  return (
    <PageShell className="email-page">
      <PageHeader
        eyebrow="Communications"
        title="Email Logs"
        description="Inspect generated schedule emails and demonstrate the weekly email requirement."
        aside={<div className="management-health management-health--ok"><strong>{logs.length} logged email{logs.length === 1 ? "" : "s"}</strong><span>{filtered.length} currently shown</span></div>}
      />

      <Toolbar>
        <Field label="Search logs" className="email-page__search"><Input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Sender, member, subject, or body" /></Field>
        <Field label="Week starts"><Input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></Field>
        <ToolbarActions>
          <Button variant="primary" onClick={() => void generate()} disabled={loading}>{loading ? "Working..." : "Generate weekly emails"}</Button>
          <Button onClick={() => void load()} disabled={loading}>Refresh</Button>
        </ToolbarActions>
      </Toolbar>

      {error && <StatusMessage tone="error">{error}</StatusMessage>}
      {message && <StatusMessage>{message}</StatusMessage>}

      <ContentCard>
        <CardHeader title="Generated email history" description="All persisted weekly schedule messages." meta={`${filtered.length} result${filtered.length === 1 ? "" : "s"}`} />
        {loading && logs.length === 0 ? <EmptyState>Loading email logs...</EmptyState> : filtered.length === 0 ? <EmptyState>No email logs found.</EmptyState> : (
          <TableContainer minWidth={980}>
            <table className="email-table">
              <thead><tr><th>ID</th><th>Date</th><th>Sender</th><th>Receiver</th><th>Team / Formation</th><th>Subject</th><th>Body preview</th></tr></thead>
              <tbody>{filtered.map((log) => <tr key={log.email_id}>
                <td>{log.email_id}</td><td>{String(log.email_date).slice(0, 10)}</td><td>{log.sender_name ?? "—"}</td>
                <td><strong>{[log.receiver_first_name, log.receiver_last_name].filter(Boolean).join(" ") || `Member ${log.membership_number}`}</strong><br />{log.receiver_email ?? "—"}</td>
                <td>{log.team_name ?? "—"}<br />Formation #{log.formation_id}</td><td>{log.subject}</td><td className="email-table__body">{log.body_snippet}</td>
              </tr>)}</tbody>
            </table>
          </TableContainer>
        )}
      </ContentCard>
    </PageShell>
  );
}
