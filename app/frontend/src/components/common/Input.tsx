import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export function Field({ label, children, disabled = false, hint, className = "" }: FieldProps) {
  return (
    <label className={["management-field", disabled ? "management-field--disabled" : "", className].filter(Boolean).join(" ")}>
      <span className="management-field__label">{label}</span>
      {children}
      {hint && <small className="management-field__hint">{hint}</small>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input className={["management-input", className].filter(Boolean).join(" ")} {...rest} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", children, ...rest } = props;
  return <select className={["management-input", className].filter(Boolean).join(" ")} {...rest}>{children}</select>;
}
