import { ChevronDown, CircleUserRound } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <h1 className="navbar-title">CSCS Database System</h1>
{/* 
      <button className="user-button" type="button">
        <CircleUserRound size={28} />
        <span>Admin User</span>
        <ChevronDown size={18} />
      </button> */}
    </header>
  );
}