import React, { useEffect } from "react";
import { Loader2, X } from "lucide-react";

export const PageHeader = ({ title, description, actions }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Card = ({ className = "", children }) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-card ${className}`}>{children}</div>
);

const buttonStyles = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm disabled:bg-brand-300",
  secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:text-slate-400",
  danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm disabled:bg-rose-300",
  ghost: "text-slate-600 hover:bg-slate-100 disabled:text-slate-300",
};

export const Button = ({ variant = "primary", loading, icon: Icon, children, className = "", ...props }) => (
  <button
    {...props}
    disabled={props.disabled || loading}
    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${buttonStyles[variant]} ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}
    {children}
  </button>
);

const badgeStyles = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  slate: "bg-slate-50 text-slate-600 ring-slate-500/20",
  brand: "bg-brand-50 text-brand-700 ring-brand-600/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
  blue: "bg-brand-50 text-brand-700 ring-brand-600/20",
  red: "bg-rose-50 text-rose-700 ring-rose-600/20",
  care: "bg-care-50 text-care-600 ring-care-500/20",
};

export const Badge = ({ color = "slate", children }) => (
  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeStyles[color]}`}>
    {children}
  </span>
);

export const Spinner = ({ className = "" }) => (
  <div className={`flex items-center justify-center py-16 ${className}`}>
    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    {Icon && (
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-6 w-6 text-slate-500" />
      </div>
    )}
    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const Modal = ({ open, onClose, title, description, children, footer, size = "max-w-lg" }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} />
      <div role="dialog" aria-modal="true" className={`relative flex max-h-[90vh] w-full ${size} flex-col rounded-xl bg-white shadow-xl`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="customScrollbar overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};

export const Field = ({ label, error, children, hint }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
    {children}
    {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    {error && <span className="mt-1 block text-xs text-rose-600">{error}</span>}
  </label>
);

export const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";
