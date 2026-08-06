import {
  assignPlayer,
  removePlayerAssignment,
  updatePlayerAssignment,
} from "../../services/formations";
import type {
  PlayerRole,
} from "../../types/formation";
import { useState } from "react";

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
        </div>
  );
}
