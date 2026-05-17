"use client";

import { useState, useRef, useEffect } from "react";

export interface MultiSelectOption {
  value: string;  // o valor real (ex: "segunda" ou um UUID)
  label: string;  // o que aparece na tela (ex: "Segunda-feira")
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: boolean;
}

// Cores rotativas pros chips — turquesa, amarelo, coral em ciclo
const CHIP_COLORS = [
  { bg: "bg-turquesa", text: "text-azul" },
  { bg: "bg-amarelo", text: "text-azul" },
  { bg: "bg-coral", text: "text-white" },
];

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione...",
  error = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fecha o painel ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Fecha com Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  function toggleOption(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  function removeOption(value: string, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  }

  // Mapeia value -> label pros chips selecionados
  const selectedOptions = selected
    .map((v) => options.find((o) => o.value === v))
    .filter((o): o is MultiSelectOption => o !== undefined);

  return (
    <div ref={wrapperRef} className="relative">
      {/* Botão de controle (o "input" visual) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          w-full min-h-[52px] px-4 py-2 rounded-xl text-left
          bg-white border transition-all duration-200
          flex items-center justify-between gap-2
          ${
            error
              ? "border-2 border-coral bg-coral/5"
              : open
              ? "border-azul ring-2 ring-azul/20"
              : "border-borda hover:border-azul/40"
          }
        `}
      >
        <div className="flex-1 flex flex-wrap gap-2 items-center min-h-[36px]">
          {selectedOptions.length === 0 ? (
            <span className="text-texto-medio">{placeholder}</span>
          ) : (
            selectedOptions.map((opt, idx) => {
              const color = CHIP_COLORS[idx % CHIP_COLORS.length];
              return (
                <span
                  key={opt.value}
                  className={`
                    inline-flex items-center gap-1.5
                    px-3 py-1 rounded-full text-sm font-medium
                    ${color.bg} ${color.text}
                  `}
                >
                  <span>{opt.label}</span>
                  <span
                    role="button"
                    aria-label={`Remover ${opt.label}`}
                    onClick={(e) => removeOption(opt.value, e)}
                    className="hover:opacity-70 cursor-pointer text-base leading-none"
                  >
                    ×
                  </span>
                </span>
              );
            })
          )}
        </div>

        {/* Seta */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`
            w-5 h-5 flex-shrink-0 text-texto-medio
            transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.4a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Painel de opções */}
      {open && (
        <div
          className="
            absolute z-30 mt-2 w-full max-h-72 overflow-y-auto
            bg-white rounded-xl border border-borda shadow-lg
            py-1
          "
          role="listbox"
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleOption(opt.value)}
                className={`
                  w-full px-4 py-3 text-left flex items-center gap-3
                  transition-colors
                  ${
                    isSelected
                      ? "bg-azul/5 text-azul font-medium"
                      : "hover:bg-offwhite text-texto"
                  }
                `}
              >
                <span
                  className={`
                    w-5 h-5 rounded-md border-2 flex-shrink-0
                    flex items-center justify-center transition-all
                    ${
                      isSelected
                        ? "bg-azul border-azul"
                        : "border-borda"
                    }
                  `}
                >
                  {isSelected && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="white"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}