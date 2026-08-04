import RelationPage from "../components/common/relation-page/RelationPage";
import { familyMemberFields } from "../components/common/data-grid/relations/familyMember.fields";
import type { FamilyMember } from "../types/member";
import { familyMemberApi } from "../services/members";

export default function FamilyMembers() {
  return (
    <RelationPage<FamilyMember>
      title="Family Members"
      description="Manage family and emergency contacts."
      initialData={[]}
      columnDefs={familyMemberFields}
      api={familyMemberApi}
      idField="family_member_id"
      getRowId={(row) =>
        String(row.family_member_id)
      }
      createEmptyRow={() => ({
        family_member_id: Date.now(),
        first_name: "",
        last_name: "",
        date_of_birth: "",
        ssn: "",
        medicare_number: null,
        phone_number: null,
        email: null,
        address: null,
        city: null,
        province: null,
        postal_code: null,
      })}
    />
  );
}
