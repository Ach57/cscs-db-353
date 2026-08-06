import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Locations from "../pages/Locations";
import Personnel from "../pages/Personnel";
import FamilyMembers from "../pages/FamilyMembers";
import ClubMembers from "../pages/ClubMembers";
import TeamFormations from "../pages/TeamFormations";
import Payments from "../pages/Payments";
import Reports from "../pages/Reports";
export default function AppRouter(){return <BrowserRouter><Routes><Route element={<Layout/>}><Route path="/" element={<Dashboard/>}/><Route path="/locations" element={<Locations/>}/><Route path="/personnel" element={<Personnel/>}/><Route path="/family-members" element={<FamilyMembers/>}/><Route path="/club-members" element={<ClubMembers/>}/><Route path="/team-formations" element={<TeamFormations/>}/><Route path="/payments" element={<Payments/>}/><Route path="/reports" element={<Reports/>}/><Route path="*" element={<Dashboard/>}/></Route></Routes></BrowserRouter>}
