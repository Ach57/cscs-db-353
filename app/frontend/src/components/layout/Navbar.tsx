import {
  BarChart3,
  CreditCard,
  House,
  Mail,
  MapPin,
  Trophy,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const navigationItems = [
  { label: "Dashboard", path: "/", icon: House },
  { label: "Locations", path: "/locations", icon: MapPin },
  { label: "People", path: "/people", icon: UsersRound },
  { label: "Team Formations", path: "/team-formations", icon: UsersRound },
  { label: "Payments", path: "/payments", icon: CreditCard },
  { label: "FIFA Games", path: "/fifa-games", icon: Trophy },
  { label: "Email Logs", path: "/email-logs", icon: Mail },
  { label: "Reports", path: "/reports", icon: BarChart3 },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand-row">
        <h1 className="navbar-title">CSCS Database System</h1>
      </div>

      <nav className="navbar-nav" aria-label="Main navigation">
        <div className="navbar-nav-inner">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link-active" : ""}`
                }
              >
                <Icon size={20} strokeWidth={2} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
