"use client";

import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  required = false,
  error,
  hint,
  children,
}: FormFieldProps) {
  const hasError = Boolean(error);

  return (
    <div
      className={`mb-6 ${hasError ? "form-field-error" : ""}`}
      data-error={hasError ? "true" : "false"}
    >
      <label className="block text-sm font-semibold text-texto mb-2">
        {label}
        {required && <span className="text-coral ml-1">*</span>}
      </label>

      {children}

      {hint && !hasError && (
        <p className="text-xs text-texto-medio mt-2">{hint}</p>
      )}

      {hasError && (
        <p className="text-xs text-coral mt-2 font-medium">{error}</p>
      )}
    </div>
  );
}

/* Estilo dos inputs reutilizável — pode ser aplicado direto via className */
export const inputClass = `
  w-full px-4 py-3 rounded-xl border border-borda bg-white
  text-texto text-base
  transition-all duration-200
  placeholder:text-texto-medio
  focus:outline-none focus:border-azul focus:ring-2 focus:ring-azul/20
`;

export const inputErrorClass = `
  w-full px-4 py-3 rounded-xl border-2 border-coral bg-coral/5
  text-texto text-base
  transition-all duration-200
  placeholder:text-coral/60
  focus:outline-none focus:ring-2 focus:ring-coral/20
`;