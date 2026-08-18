import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "secondary",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const classes = [
    "button",
    variant !== "secondary" ? `button--${variant}` : "",
    fullWidth ? "button--full" : "",
    className,
  ].filter(Boolean).join(" ");

  return <button type={type} className={classes} {...props}>{children}</button>;
}
