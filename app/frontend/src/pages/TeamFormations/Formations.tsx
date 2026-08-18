import RelationPage from "../../components/common/relation-page/RelationPage";
import { teamFormationFields } from "../../components/common/data-grid/relations/teamFormation.fields";
import {
  formationApi,
} from "../../services/formations";
import type {
  TeamFormation,
  TeamFormationInput,
} from "../../types/formation";

const toFormation = (row: TeamFormation): TeamFormationInput => ({
  session_id: Number(row.session_id),
  location_id: Number(row.location_id),
  head_coach_id: Number(row.head_coach_id),
  team_name: row.team_name.trim(),
  score: row.score == null ? null : Number(row.score),
  team_category: row.team_category,
});

export default function Formations() {
  return (
        <RelationPage<TeamFormation, TeamFormationInput, Partial<TeamFormationInput>>
        title="Team Formations"
        description="Create formations linked to sessions, locations and head coaches."
        columnDefs={teamFormationFields}
        api={formationApi}
        idField="formation_id"
        getRowId={(row) => String(row.formation_id)}
        createEmptyRow={() => ({
            formation_id: -Date.now(),
            session_id: 0,
            location_id: 0,
            head_coach_id: 0,
            team_name: "",
            score: null,
            team_category: "Boys",
        })}
        validateRow={(row) => [
            row.session_id <= 0 ? "Session ID is required." : "",
            row.location_id <= 0 ? "Location ID is required." : "",
            row.head_coach_id <= 0 ? "Head coach ID is required." : "",
            !row.team_name.trim() ? "Team name is required." : "",
        ].filter(Boolean)}
        toCreateInput={toFormation}
        toUpdateInput={toFormation}
        />
  );
}
