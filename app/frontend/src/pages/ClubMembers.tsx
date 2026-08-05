import RelationPage from "../components/common/relation-page/RelationPage";
import { clubMemberFields } from "../components/common/data-grid/relations/clubMember.fields";
import type { ClubMember } from "../types/member";
import { clubMemberApi } from "../services/members";

export default function ClubMembers() {
  return (
    <RelationPage<ClubMember>
      title="Club Members"
      description="Manage registered soccer club members."
      initialData={[]}
      columnDefs={clubMemberFields}
      api={clubMemberApi}
      idField="membership_number"
      getRowId={(row) => String(row.membership_number)}
      createEmptyRow={() => ({
        membership_number: Date.now(),
        location_id: 1,
        first_name: "",
        last_name: "",
        date_of_birth: "",
        registration_date: new Date()
          .toISOString()
          .slice(0, 10),
        height_cm: null,
        weight_kg: null,
        phone_number: null,
        email: null,
        ssn: null,
        medicare_number: null,
        address: null,
        city: null,
        province: null,
        postal_code: null,
      })}
    />
  );
}
