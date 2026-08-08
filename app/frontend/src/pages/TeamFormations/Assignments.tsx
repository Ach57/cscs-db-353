import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../../components/common/Button";
import { Field, Input, Select } from "../../components/common/Input";
import {
  CardHeader,
  ContentCard,
  EmptyState,
  PageHeader,
  PageShell,
  StatusMessage,
  TableContainer,
  Toolbar,
  ToolbarActions,
} from "../../components/common/page/ManagementPage";
import {
  assignPlayer,
  getMemberAssignmentOverview,
  removePlayerAssignment,
  updatePlayerAssignment,
} from "../../services/formations";
import type { MemberAssignmentOverview, PlayerRole } from "../../types/formation";

const roles: PlayerRole[] = [
  "Goalkeeper", "Right Fullback", "Left Fullback", "Center Back",
  "Center Back or Sweeper", "Defending or Holding Midfielder",
  "Right Midfielder or Winger", "Central Midfielder", "Striker",
  "Attacking Midfielder", "Left Winger",
];

export default function Assignments() {
  const [formationId, setFormationId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [role, setRole] = useState<PlayerRole>("Goalkeeper");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [overview, setOverview] = useState<MemberAssignmentOverview[]>([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [search, setSearch] = useState("");

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      setOverview(await getMemberAssignmentOverview());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load member assignments.");
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  useEffect(() => { void loadOverview(); }, [loadOverview]);

  const visibleMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return overview;
    return overview.filter((member) =>
      [member.membership_number, member.first_name, member.last_name, member.location_name, member.assigned_teams]
        .some((value) => String(value ?? "").toLowerCase().includes(term)),
    );
  }, [overview, search]);

  async function action(kind: "add" | "update" | "remove") {
    setError("");
    setMessage("");
    try {
      const formation = Number(formationId);
      const member = Number(memberId);
      if (!formation || !member) throw new Error("Formation ID and membership number are required.");

      if (kind === "add") await assignPlayer(formation, member, role);
      else if (kind === "update") await updatePlayerAssignment(formation, member, role);
      else await removePlayerAssignment(formation, member);

      setMessage(kind === "remove" ? "Player assignment removed." : `Player assignment ${kind === "add" ? "created" : "updated"}.`);
      await loadOverview();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Assignment failed.");
    }
  }

  return (
    <PageShell className="assignment-page">
      <PageHeader
        eyebrow="Team formations"
        title="Player Assignments"
        description="Assign, update, or remove players while preserving the existing backend integrity checks."
        aside={<div className="management-health management-health--ok"><strong>{overview.length} members</strong><span>{visibleMembers.length} currently shown</span></div>}
      />

      <Toolbar>
        <Field label="Formation ID"><Input value={formationId} onChange={(event) => setFormationId(event.target.value)} inputMode="numeric" /></Field>
        <Field label="Membership number"><Input value={memberId} onChange={(event) => setMemberId(event.target.value)} inputMode="numeric" /></Field>
        <Field label="Player role" className="assignment-page__role"><Select  style={{ maxWidth: "-webkit-fit-content" }} value={role} onChange={(event) => setRole(event.target.value as PlayerRole)}>{roles.map((playerRole) => <option key={playerRole}>{playerRole}</option>)}</Select></Field>
        <ToolbarActions>
          <Button variant="primary" onClick={() => void action("add")}>Assign</Button>
          <Button onClick={() => void action("update")}>Update role</Button>
          <Button variant="danger" onClick={() => void action("remove")}>Remove</Button>
        </ToolbarActions>
      </Toolbar>

      {error && <StatusMessage tone="error">{error}</StatusMessage>}
      {message && <StatusMessage>{message}</StatusMessage>}

      <ContentCard>
        <CardHeader
          title="All member assignments"
          description="Select a row to reuse that membership number in the assignment form."
          meta={`${visibleMembers.length} result${visibleMembers.length === 1 ? "" : "s"}`}
        />
        <div className="assignment-page__search"><Field label="Search members"><Input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ID, name, location, or team" /></Field></div>
        {loadingOverview ? <EmptyState>Loading assignments...</EmptyState> : visibleMembers.length === 0 ? <EmptyState>No matching members found.</EmptyState> : (
          <TableContainer minWidth={760}>
            <table>
              <thead><tr><th>Member ID</th><th>Member</th><th>Current location</th><th>Assigned team(s)</th><th>Count</th></tr></thead>
              <tbody>{visibleMembers.map((member) => (
                <tr key={member.membership_number} className="assignment-page__row" onClick={() => setMemberId(String(member.membership_number))} title="Use this membership number">
                  <td>{member.membership_number}</td>
                  <td>{member.first_name} {member.last_name}</td>
                  <td>{member.location_name}</td>
                  <td>{member.assigned_teams ?? <span className="assignment-page__null">Not assigned</span>}</td>
                  <td>{member.assignment_count}</td>
                </tr>
              ))}</tbody>
            </table>
          </TableContainer>
        )}
      </ContentCard>
    </PageShell>
  );
}
