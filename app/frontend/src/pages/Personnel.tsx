import RelationPage from "../components/common/relation-page/RelationPage";
import { personnelFields } from "../components/common/data-grid/relations/personnel.fields";
import type { Personnel } from "../types/personnel";
import { personnelApi } from "../services/personnel";

export default function PersonnelPage() {
  return (
    <RelationPage<Personnel>
      title="Personnel"
      description="Manage coaches, trainers and administrators."
      initialData={[]}
      columnDefs={personnelFields}
      api={personnelApi}
      idField="personnel_id"
      getRowId={(row) => String(row.personnel_id)}
      createEmptyRow={() => ({
        personnel_id: Date.now(),
        first_name: "",
        last_name: "",
        date_of_birth: "",
        ssn: "",
        medicare_number: null,
        address: null,
        postal_code: null,
        phone_number: null,
        email: null,
        city: null,
        province: null,
        role: "Other",
        mandate: "Volunteer",
      })}
    />
  );
}
