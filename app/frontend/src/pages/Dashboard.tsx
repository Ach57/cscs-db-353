import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, PageShell } from "../components/common/page/ManagementPage";
import { api } from "../services/api";
import "./Dashboard.css";

type Health = { status:string; database:string; latency_ms:number };

const destinations = [
  ["Locations", "Create, edit, delete, and display club locations.", "/locations"],
  ["People", "Manage personnel, family members, and club members.", "/personnel"],
  ["Sessions & formations", "Schedule sessions and create team formations.", "/team-formations"],
  ["Payments", "Record annual fees and installments.", "/payments"],
  ["Reports Q8–Q19", "Run required complex queries and inspect results.", "/reports"],
  ["Email logs", "Generate and inspect weekly schedule emails.", "/email-logs"],
] as const;

export default function Dashboard() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    api.get<Health>("/health").then(setHealth).catch(() => setHealth(null));
  }, []);

  return (
    <PageShell className="dashboard-page">
      <PageHeader
        eyebrow="COMP 353 · Summer 2026"
        title="Country Soccer Club System"
        description="Database administration and demonstration interface for the main project."
        aside={<div className={`management-health management-health--${health ? "ok" : "bad"}`}><strong>{health ? "AITS / MySQL connected" : "Backend not connected"}</strong><span>{health ? `${health.latency_ms} ms response` : "Check API URL and server"}</span></div>}
      />

      <nav className="dashboard-page__grid" aria-label="Main areas">
        {destinations.map(([title, description, path]) => (
          <Link className="dashboard-page__card" to={path} key={title}>
            <div><h2>{title}</h2><p>{description}</p></div>
            <span>Open</span>
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}
