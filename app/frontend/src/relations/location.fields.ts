import type { ColDef } from "ag-grid-community";
import type { Location } from "../types/location";
export const locationFields: ColDef<Location>[] = [
  {
    field: "location_id",
    headerName: "Location ID",
    minWidth: 140,
  },
  {
    field: "location_type",
    headerName: "Type",
    minWidth: 130,
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
    field: "web_address",
    headerName: "Website",
    minWidth: 220,
  },
  {
    field: "capacity",
    headerName: "Capacity",
    minWidth: 130,
    filter: "agNumberColumnFilter",
  },
];