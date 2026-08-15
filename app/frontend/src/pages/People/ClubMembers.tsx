import RelationPage from '../../components/common/relation-page/RelationPage';
import { clubMemberFields } from '../../components/common/data-grid/relations/clubMember.fields';
import type { ClubMember, ClubMemberInput } from '../../types/member';
import { clubMemberApi } from '../../services/members';
const optional = (v: string | null) => v?.trim() || undefined;

const toInput = (r: ClubMember): ClubMemberInput => ({
  location_id: Number(r.location_id),
  first_name: r.first_name.trim(),
  last_name: r.last_name.trim(),
  date_of_birth: r.date_of_birth,
  gender: r.gender,
  registration_date: r.registration_date,
  height_cm: r.height_cm == null ? undefined : Number(r.height_cm),
  weight_kg: r.weight_kg == null ? undefined : Number(r.weight_kg),
  ssn: optional(r.ssn),
  medicare_number: optional(r.medicare_number),
  phone_number: optional(r.phone_number),
  email: optional(r.email),
  address: optional(r.address),
  city: optional(r.city),
  province: optional(r.province)?.toUpperCase(),
  postal_code: optional(r.postal_code),
});

// family_relation is create-only; family links are managed on the Family Members page.
const toCreateInput = (r: ClubMember): ClubMemberInput => {
  const base = toInput(r);
  if (!r.family_member_id) return base;
  return {
    ...base,
    family_relation: {
      family_member_id: Number(r.family_member_id),
      relationship_type: r.relationship_type || 'Other',
      family_member_type: r.family_member_type || 'Primary',
      start_date: r.registration_date,
    },
  };
};

export default function ClubMembers() {
  return (
    <RelationPage<ClubMember, ClubMemberInput, Partial<ClubMemberInput>>
      title="Club Members"
      description="Create, edit, display and delete major/minor club members."
      columnDefs={clubMemberFields}
      api={clubMemberApi}
      idField="membership_number"
      getRowId={(r) => String(r.membership_number)}
      createEmptyRow={() => ({
        membership_number: -Date.now(),
        location_id: 1,
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'Male',
        registration_date: new Date().toISOString().slice(0, 10),
        height_cm: null,
        weight_kg: null,
        phone_number: null,
        email: null,
        ssn: null,
        medicare_number: null,
        address: null,
        city: null,
        province: 'QC',
        postal_code: null,
        family_member_id: null,
        relationship_type: null,
        family_member_type: null,
      })}
      validateRow={(r) =>
        [
          !r.first_name.trim() ? 'First name is required.' : '',
          !r.last_name.trim() ? 'Last name is required.' : '',
          !r.date_of_birth ? 'Date of birth is required.' : '',
          !r.location_id ? 'Location ID is required.' : '',
        ].filter(Boolean)
      }
      toCreateInput={toCreateInput}
      toUpdateInput={toInput}
    />
  );
}
