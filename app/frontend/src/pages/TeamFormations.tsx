import RelationPage from "../components/common/relation-page/RelationPage";
import { teamFormationFields } from "../relations/teamFormation.fields";
import type { TeamFormation } from "../types/formation";

export default function TeamFormations() {
  return (
    <RelationPage<TeamFormation>
      title="Team Formations"
      description="Manage games, practices and team formations."
      initialData={[]}
      columnDefs={teamFormationFields}
      getRowId={(row) => String(row.formation_id)}
      createEmptyRow={() => ({
        formation_id: Date.now(),
        location_id: 1,
        team_name: "",
        opponent_team_name: "",
        head_coach_id: 0,
        session_nature: "Practice",
        session_start: "",
        address: "",
        score: 0,
        opponent_score: 0,
        gender: "",
      })}
    />
  );
}