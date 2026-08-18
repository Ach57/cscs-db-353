import type { LucideIcon } from "lucide-react";

export interface WorkspaceTabItem<T extends string> {
  id: T;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface WorkspaceTabsProps<T extends string> {
  items: WorkspaceTabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}

export default function WorkspaceTabs<T extends string>({
  items,
  activeId,
  onChange,
  ariaLabel,
}: WorkspaceTabsProps<T>) {
  return (
    <nav className="workspace-tabs" aria-label={ariaLabel}>
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            className={`workspace-tab ${active ? "workspace-tab--active" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <Icon size={19} aria-hidden="true" />
            <span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
