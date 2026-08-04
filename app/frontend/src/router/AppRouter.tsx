import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Locations from "../pages/Locations";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <section>
      <h2>{title}</h2>
      <p>This page is under development.</p>
    </section>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/locations"
            element={<Locations/>}
          />

          <Route
            path="/personnel"
            element={<PlaceholderPage title="Personnel" />}
          />

          <Route
            path="/family-members"
            element={<PlaceholderPage title="Family Members" />}
          />

          <Route
            path="/club-members"
            element={<PlaceholderPage title="Club Members" />}
          />

          <Route
            path="/team-formations"
            element={<PlaceholderPage title="Team Formations" />}
          />

          <Route
            path="/payments"
            element={<PlaceholderPage title="Payments" />}
          />

          <Route
            path="/reports"
            element={<PlaceholderPage title="Reports" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}