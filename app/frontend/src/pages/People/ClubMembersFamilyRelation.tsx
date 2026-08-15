import RelationPage from '../../components/common/relation-page/RelationPage';
import { familyRelationFields } from '../../components/common/data-grid/relations/familyRelation.fields';
import type { FamilyRelation, FamilyRelationInput } from '../../types/member';
import { familyRelationApi } from '../../services/members';

const toInput = (r: FamilyRelation): FamilyRelationInput => ({
  membership_number: Number(r.membership_number),
  family_member_id: Number(r.family_member_id),
  relationship_type: r.relationship_type,
  family_member_type: r.family_member_type,
  start_date: r.start_date,
  end_date: r.end_date ?? undefined,
});

export default function ClubMembersFamilyRelation() {
  return (
    <RelationPage<FamilyRelation, FamilyRelationInput, Partial<FamilyRelationInput>>
      title="Club Members Family Relation"
      description="Manage family member relationships linked to club members."
      columnDefs={familyRelationFields}
      api={familyRelationApi}
      idField="relation_id"
      getRowId={(r) => String(r.relation_id)}
      createEmptyRow={() => ({
        relation_id: -Date.now(),
        membership_number: 0,
        family_member_id: 0,
        first_name: '',
        last_name: '',
        relationship_type: 'Other',
        family_member_type: 'Primary',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: null,
      })}
      validateRow={(r) =>
        [
          !r.membership_number ? 'Membership number is required.' : '',
          !r.family_member_id ? 'Family member ID is required.' : '',
          !r.start_date ? 'Start date is required.' : '',
        ].filter(Boolean)
      }
      toCreateInput={toInput}
      toUpdateInput={toInput}
    />
  );
}

