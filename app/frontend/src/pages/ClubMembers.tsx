import RelationPage from "../components/common/relation-page/RelationPage";
import { clubMemberFields } from "../relations/clubMember.fields";
import type { ClubMember } from "../types/member";

export default function ClubMembers() {
  return (
    <RelationPage<ClubMember>
      title="Club Members"
      description="Manage registered soccer club members."
      initialData={[]}
      columnDefs={clubMemberFields}
      getRowId={(row) => row.membership_number}
      createEmptyRow={() => ({
        membership_number: `CM${Date.now()}`,
        location_id: 1,
        first_name: "",
        last_name: "",
        date_of_birth: "",
        registration_date: new Date()
          .toISOString()
          .slice(0, 10),
        height_cm: 0,
        weight_kg: 0,
        phone_number: "",
        email: "",
      })}
    />
  );
}