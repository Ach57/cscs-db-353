import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Locations from "../pages/Locations";
import People from "../pages/People/People";
import TeamFormations from "../pages/TeamFormations/TeamFormations";
import Payments from "../pages/Payments";
import Reports from "../pages/Reports";
import EmailLogs from "../pages/EmailLogs";
import FifaGames from "../pages/FifaGames";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/people" element={<People />} />
          <Route path="/personnel" element={<Navigate to="/people?tab=personnel" replace />} />
          <Route path="/family-members" element={<Navigate to="/people?tab=family-members" replace />} />
          <Route path="/club-members" element={<Navigate to="/people?tab=club-members" replace />} />
          <Route path="/team-formations" element={<TeamFormations />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/fifa-games" element={<FifaGames />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/email-logs" element={<EmailLogs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
