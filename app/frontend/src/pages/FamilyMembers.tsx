import RelationPage from "../components/common/relation-page/RelationPage";
import { familyMemberFields } from "../relations/familyMember.fields";
import type { FamilyMember } from "../types/member";

export default function FamilyMembers() {
  return (
    <RelationPage<FamilyMember>
      title="Family Members"
      description="Manage family and emergency contacts."
      initialData={[]}
      columnDefs={familyMemberFields}
      getRowId={(row) =>
        String(row.family_member_id)
      }
      createEmptyRow={() => ({
        family_member_id: Date.now(),
        first_name: "",
        last_name: "",
        date_of_birth: "",
        phone_number: "",
        email: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
      })}
    />
  );
}