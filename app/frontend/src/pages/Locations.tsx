import { useEffect, useState } from "react";

import DataGrid from "../components/common/data-grid/DataGrid";
import type { Location } from "../components/types/location";
import { locationFields } from "../relations";

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadLocations() {
      try {
        const response = await fetch("/api/locations");

        if (!response.ok) {
          throw new Error("Could not load locations");
        }

        const data: Location[] = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Failed to load locations:", error);
      } finally {
        setLoading(false);
      }
    }

    // void loadLocations();
    setLocations([
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
])
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Locations</h1>
          <p>Manage club locations.</p>
        </div>
      </div>

      <DataGrid<Location>
        rowData={locations}
        columnDefs={locationFields}
        loading={loading}
        getRowId={(location) =>
          location.location_id.toString()
        }
        onRowClick={(location) => {
          console.log("Selected location:", location);
        }}
      />
    </section>
  );
}