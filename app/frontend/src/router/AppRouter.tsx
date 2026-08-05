import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Locations from "../pages/Locations";
import Personnel from "../pages/Personnel";
import FamilyMembers from "../pages/FamilyMembers";

function PlaceholderPage({ title }: { title: string }) {
  return <section><h2>{title}</h2><p>This page is under development.</p></section>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/family-members" element={<FamilyMembers />} />
          <Route path="/club-members" element={<PlaceholderPage title="Club Members" />} />
          <Route path="/team-formations" element={<PlaceholderPage title="Team Formations" />} />
          <Route path="/payments" element={<PlaceholderPage title="Payments" />} />
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
