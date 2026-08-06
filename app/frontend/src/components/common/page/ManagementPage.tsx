import type { ReactNode } from "react";
import "./ManagementPage.css";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  aside?: ReactNode;
}

export function PageShell({ children, className = "" }: PageShellProps) {
  return <section className={["management-page", className].filter(Boolean).join(" ")}>{children}</section>;
}

export function PageHeader({ title, description, eyebrow, aside }: PageHeaderProps) {
  return (
    <header className="management-page__header">
      <div className="management-page__heading">
        {eyebrow && <p className="management-page__eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {aside && <div className="management-page__aside">{aside}</div>}
    </header>
  );
}

export function Toolbar({ children, className = "" }: PageShellProps) {
  return <div className={["management-toolbar", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function ToolbarActions({ children, className = "" }: PageShellProps) {
  return <div className={["management-toolbar__actions", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function StatusMessage({ children, tone = "success" }: { children: ReactNode; tone?: "success" | "error" | "warning" }) {
  return <p role={tone === "error" ? "alert" : undefined} className={`management-status management-status--${tone}`}>{children}</p>;
}

export function ContentCard({ children, className = "" }: PageShellProps) {
  return <div className={["management-card", className].filter(Boolean).join(" ")}>{children}</div>;
}

export function CardHeader({ title, description, meta }: { title: string; description?: string; meta?: ReactNode }) {
  return (
    <div className="management-card__header">
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
      {meta && <div className="management-card__meta">{meta}</div>}
    </div>
  );
}

export function TableContainer({ children, minWidth, className = "" }: PageShellProps & { minWidth?: number }) {
  return <div className={["management-table-wrap", className].filter(Boolean).join(" ")}><div style={minWidth ? { minWidth } : undefined}>{children}</div></div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="management-empty">{children}</p>;
}
