import RelationPage from "../components/common/relation-page/RelationPage";
import { teamFormationFields } from "../components/common/data-grid/relations/teamFormation.fields";
import type { TeamFormation } from "../types/formation";
import { formationApi } from "../services/formations";

export default function TeamFormations() {
  return (
    <RelationPage<TeamFormation>
      title="Team Formations"
      description="Manage games, practices and team formations."
      initialData={[]}
      columnDefs={teamFormationFields}
      api={formationApi}
      idField="formation_id"
      getRowId={(row) => String(row.formation_id)}
      createEmptyRow={() => ({
        formation_id: Date.now(),
        location_id: 1,
        team_name: "",
        opponent_team_name: "",
        head_coach_id: 0,
        session_nature: "Training",
        session_start: "",
        address: "",
        score: null,
        opponent_score: null,
        gender: "Boys",
      })}
    />
  );
}
