import { useSearchParams } from 'react-router-dom';
import {
  ShieldUser,
  UserRound,
  UsersRound,
  Users,
  UserStar,
} from 'lucide-react';
import WorkspaceTabs, {
  type WorkspaceTabItem,
} from '../../components/common/WorkspaceTabs';
import Personnel from './Personnel';
import FamilyMembers from './FamilyMembers';
import ClubMembers from './ClubMembers';
import ClubMembersFamilyRelation from './ClubMembersFamilyRelation';
import PersonnelAssignmentsOverview from './PersonnelAssignment';

type PeopleTab =
  | 'personnel'
  | 'family-members'
  | 'club-members'
  | 'club-members-family-relation'
  | 'personnel-assignment';

const tabs: WorkspaceTabItem<PeopleTab>[] = [
  {
    id: 'personnel',
    label: 'Personnel',
    description: 'Staff, coaches, administrators, roles, and mandates',
    icon: UsersRound,
  },
  {
    id: 'family-members',
    label: 'Family Members',
    description: 'Primary and secondary contacts associated with minors',
    icon: UserRound,
  },
  {
    id: 'club-members',
    label: 'Club Members',
    description: 'Major and minor players, status, location, and profile data',
    icon: ShieldUser,
  },
  {
    id: 'club-members-family-relation',
    label: 'Club Members Family Relation',
    description: 'Family members relationship to the club members',
    icon: Users,
  },
  {
    id: 'personnel-assignment',
    label: 'Personnel Assignments',
    description:
      'Assignment of personnel by location id, start and ending date',
    icon: UserStar,
  },
];

function isPeopleTab(value: string | null): value is PeopleTab {
  return tabs.some((tab) => tab.id === value);
}

export default function People() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const activeTab: PeopleTab = isPeopleTab(requestedTab)
    ? requestedTab
    : 'personnel';

  function changeTab(tab: PeopleTab) {
    setSearchParams({ tab });
  }

  return (
    <section className="workspace-page people-page">
      <WorkspaceTabs
        items={tabs}
        activeId={activeTab}
        onChange={changeTab}
        ariaLabel="People categories"
      />

      <div className="workspace-content">
        {activeTab === 'personnel' && <Personnel />}
        {activeTab === 'family-members' && <FamilyMembers />}
        {activeTab === 'club-members' && <ClubMembers />}
        {activeTab === 'club-members-family-relation' && (
          <ClubMembersFamilyRelation />
        )}
        {activeTab === 'personnel-assignment' && (
          <PersonnelAssignmentsOverview />
        )}
      </div>
    </section>
  );
}
