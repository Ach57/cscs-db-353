import {
  BarChart3,
  CreditCard,
  House,
  MapPin,
  ShieldUser,
  UserRound,
  UsersRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: House,
  },
  {
    label: "Locations",
    path: "/locations",
    icon: MapPin,
  },
  {
    label: "Personnel",
    path: "/personnel",
    icon: UsersRound,
  },
  {
    label: "Family Members",
    path: "/family-members",
    icon: UserRound,
  },
  {
    label: "Club Members",
    path: "/club-members",
    icon: ShieldUser,
  },
  {
    label: "Team Formations",
    path: "/team-formations",
    icon: UsersRound,
  },
  {
    label: "Payments",
    path: "/payments",
    icon: CreditCard,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <Icon size={23} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}