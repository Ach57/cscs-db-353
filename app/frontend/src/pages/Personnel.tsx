import RelationPage from "../components/common/relation-page/RelationPage";
import { personnelFields } from "../relations/personnel.fields";
import type { Personnel } from "../types/personnel";

export default function PersonnelPage() {
  return (
    <RelationPage<Personnel>
      title="Personnel"
      description="Manage coaches, trainers and administrators."
      initialData={[]}
      columnDefs={personnelFields}
      getRowId={(row) => String(row.personnel_id)}
      createEmptyRow={() => ({
        personnel_id: Date.now(),
        first_name: "",
        last_name: "",
        date_of_birth: "",
        phone_number: "",
        email: "",
        city: "",
        province: "",
        role: "",
        mandate: "",
      })}
    />
  );
}