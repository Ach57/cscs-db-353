import type { ColDef, ValueSetterParams } from "ag-grid-community";
import type { Location } from "../../../../types/location";

function parsePhoneNumbers(value: unknown): { phone_number: string }[] {
  const uniqueNumbers = new Set(
    String(value ?? "")
      .split(/[;,\n]/)
      .map((phone) => phone.trim())
      .filter(Boolean),
  );

  return [...uniqueNumbers].map((phone_number) => ({ phone_number }));
}

export const locationFields: ColDef<Location>[] = [
  {
    field: "location_id",
    headerName: "Location ID",
    minWidth: 140,
    editable: false,
  },
  {
    field: "location_type",
    headerName: "Type",
    minWidth: 130,
    cellEditor: "agSelectCellEditor",
    cellEditorParams: { values: ["Head", "Branch"] },
  },
  {
    field: "name",
    headerName: "Location Name",
    minWidth: 190,
  },
  {
    field: "address",
    headerName: "Address",
    minWidth: 170,
  },
  {
    field: "city",
    headerName: "City",
    minWidth: 130,
  },
  {
    field: "province",
    headerName: "Province",
    minWidth: 130,
  },
  {
    field: "postal_code",
    headerName: "Postal Code",
    minWidth: 150,
  },
  {
    headerName: "Phone Number(s)",
    colId: "phone_numbers",
    minWidth: 220,
    valueGetter: ({ data }) =>
      data?.location_phone?.map((phone) => phone.phone_number).join(", ") ?? "",
    valueSetter: (params: ValueSetterParams<Location>) => {
      if (!params.data) return false;
      params.data.location_phone = parsePhoneNumbers(params.newValue);
      return true;
    },
    filterValueGetter: ({ data }) =>
      data?.location_phone?.map((phone) => phone.phone_number).join(" ") ?? "",
  },
  {
    field: "web_address",
    headerName: "Website",
    minWidth: 220,
  },
  {
    field: "capacity",
    headerName: "Capacity",
    minWidth: 130,
    filter: "agNumberColumnFilter",
    cellEditor: "agNumberCellEditor",
    valueParser: ({ newValue }) => Number(newValue),
  },
];
