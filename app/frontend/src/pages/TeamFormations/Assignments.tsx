import {
  assignPlayer,
  getMemberAssignmentOverview,
  removePlayerAssignment,
  updatePlayerAssignment,
} from "../../services/formations";
import type { MemberAssignmentOverview, PlayerRole } from "../../types/formation";
import { useCallback, useEffect, useMemo, useState } from "react";

const roles: PlayerRole[] = [
  "Goalkeeper",
  "Right Fullback",
  "Left Fullback",
  "Center Back",
  "Center Back or Sweeper",
  "Defending or Holding Midfielder",
  "Right Midfielder or Winger",
  "Central Midfielder",
  "Striker",
  "Attacking Midfielder",
  "Left Winger",
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

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

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
      if (!formation || !member) {
        throw new Error("Formation ID and membership number are required.");
      }

      if (kind === "add") await assignPlayer(formation, member, role);
      else if (kind === "update") await updatePlayerAssignment(formation, member, role);
      else await removePlayerAssignment(formation, member);

      setMessage(
        kind === "remove"
          ? "Player assignment removed."
          : `Player assignment ${kind === "add" ? "created" : "updated"}.`,
      );
      await loadOverview();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Assignment failed.");
    }
  }

  return (
    <div className="assignment-panel">
      <h1>Formation Player Assignment</h1>
      <p>
        Add, edit or remove a player. Backend integrity rules reject gender, location,
        and less-than-three-hour conflicts.
      </p>
      <div className="report-controls">
        <label>
          Formation ID
          <input value={formationId} onChange={(event) => setFormationId(event.target.value)} inputMode="numeric" />
        </label>
        <label>
          Membership number
          <input value={memberId} onChange={(event) => setMemberId(event.target.value)} inputMode="numeric" />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value as PlayerRole)}>
            {roles.map((playerRole) => <option key={playerRole}>{playerRole}</option>)}
          </select>
        </label>
        <button className="button button--primary" onClick={() => void action("add")}>Assign</button>
        <button className="button" onClick={() => void action("update")}>Update role</button>
        <button className="button button--danger" onClick={() => void action("remove")}>Remove</button>
      </div>
      {error && <p className="relation-page__status relation-page__status--error">{error}</p>}
      {message && <p className="relation-page__status">{message}</p>}

      <section className="assignment-overview">
        <div className="assignment-overview__header">
          <div>
            <h2>All member assignments</h2>
            <p>Every member is listed. Unassigned members show a null team value.</p>
          </div>
          <label>
            Search members
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ID, name, location or team" />
          </label>
        </div>
        {loadingOverview ? <p>Loading assignments...</p> : (
          <div className="report-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Member</th>
                  <th>Current location</th>
                  <th>Assigned team(s)</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {visibleMembers.map((member) => (
                  <tr
                    key={member.membership_number}
                    className="assignment-overview__row"
                    onClick={() => setMemberId(String(member.membership_number))}
                    title="Click to use this membership number"
                  >
                    <td>{member.membership_number}</td>
                    <td>{member.first_name} {member.last_name}</td>
                    <td>{member.location_name}</td>
                    <td>{member.assigned_teams ?? <span className="assignment-overview__null">null</span>}</td>
                    <td>{member.assignment_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
