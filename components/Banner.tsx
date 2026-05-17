"use client";

interface BannerProps {
  numErrors: number;
  visible: boolean;
}

export function Banner({ numErrors, visible }: BannerProps) {
  if (!visible || numErrors === 0) return null;

  const title =
    numErrors === 1 ? "Falta 1 campo" : `Faltam ${numErrors} campos`;
  const msg =
    numErrors === 1
      ? "Confere o campo marcado em coral logo abaixo."
      : "Confere os campos marcados em coral logo abaixo.";

  return (
    <div
      role="alert"
      className="
        mb-6 p-4 rounded-xl
        bg-coral/10 border border-coral
        flex items-start gap-3
      "
    >
      <div className="flex-shrink-0 mt-0.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-coral"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-coral">{title}</p>
        <p className="text-sm text-texto-medio">{msg}</p>
      </div>
    </div>
  );
}