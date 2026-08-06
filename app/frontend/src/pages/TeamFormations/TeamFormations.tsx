import { useSearchParams } from "react-router-dom";
import { CalendarDays, ClipboardList, UsersRound } from "lucide-react";
import WorkspaceTabs, { type WorkspaceTabItem } from "../../components/common/WorkspaceTabs";
import Session from "./Sessions";
import Assignments from "./Assignments";
import Formations from "./Formations";

type FormationTab = "sessions" | "formations" | "assignments";

const tabs: WorkspaceTabItem<FormationTab>[] = [
  {
    id: "sessions",
    label: "Sessions",
    description: "Create games and training sessions with date, time, and address",
    icon: CalendarDays,
  },
  {
    id: "formations",
    label: "Team Formations",
    description: "Connect teams to sessions, locations, coaches, and scores",
    icon: ClipboardList,
  },
  {
    id: "assignments",
    label: "Player Assignments",
    description: "Assign players and roles while enforcing backend integrity rules",
    icon: UsersRound,
  },
];

function isFormationTab(value: string | null): value is FormationTab {
  return tabs.some((tab) => tab.id === value);
}

export default function TeamFormations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab: FormationTab = isFormationTab(requestedTab) ? requestedTab : "sessions";

  return (
    <section className="workspace-page formation-workspace">

      <WorkspaceTabs
        items={tabs}
        activeId={activeTab}
        onChange={(tab) => setSearchParams({ tab })}
        ariaLabel="Team formation categories"
      />

      <div className="workspace-content">
        {activeTab === "sessions" && (
          <Session/>
        )}

        {activeTab === "formations" && (
          <Formations/>
        )}

        {activeTab === "assignments" && (
          <Assignments/>
        )}
      </div>
    </section>
  );
}
