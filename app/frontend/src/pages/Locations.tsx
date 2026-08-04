import RelationPage from "../components/common/relation-page/RelationshipPage";
import { locationFields } from "../relations/location.fields";
// import { locations } from "../data/locations.data";
import type { Location } from "../types/location";

export default function Locations() {

  return (
    <RelationPage<Location>
      title="Locations"
      description="Manage club locations."
      initialData={[
  {
    location_id: 1,
    location_type: "Head",
    name: "Downtown Soccer Centre",
    address: "123 Main St",
    city: "Montreal",
    province: "QC",
    postal_code: "H2X 1A1",
    web_address: "https://downtownsoccer.ca",
    capacity: 450,
  },
  {
    location_id: 2,
    location_type: "Branch",
    name: "West Island Complex",
    address: "88 Lakeshore Blvd",
    city: "Dorval",
    province: "QC",
    postal_code: "H9S 4B5",
    web_address: "https://westislandsoccer.ca",
    capacity: 300,
  },
  {
    location_id: 3,
    location_type: "Branch",
    name: "North Sports Centre",
    address: "50 Arena Rd",
    city: "Laval",
    province: "QC",
    postal_code: "H7N 2K3",
    web_address: "https://northsports.ca",
    capacity: 600,
  },
]}
      columnDefs={locationFields}
      getRowId={(row) => String(row.location_id)}
      createEmptyRow={() => ({
        location_id: Date.now(),
        location_type: "Branch",
        name: "",
        address: "",
        city: "",
        province: "",
        postal_code: "",
        web_address: "",
        capacity: 0,
      })}
    />
  );
}