"use client";

import Image from "next/image";

export function SuccessScreen() {
  return (
    <div className="text-center py-8 px-4">
      <div className="mb-8 inline-block relative">
        <Image
          src="/logo-coral.png"
          alt="Instituto Estrelar"
          width={240}
          height={120}
          className="h-auto w-44 md:w-52 mx-auto"
        />
        {/* Estrelinhas decorativas — grafismo oficial Estrelar */}
        {/* Topo */}
        <svg
          className="absolute -top-4 -left-2 w-5 h-5 text-amarelo"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.452 4.584 23.413l1.48-8.279L0 9.306l8.332-1.151z" />
        </svg>
        <svg
          className="absolute -top-6 right-8 w-7 h-7 text-amarelo"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.452 4.584 23.413l1.48-8.279L0 9.306l8.332-1.151z" />
        </svg>

        {/* Laterais */}
        <svg
          className="absolute top-1/3 -left-8 w-4 h-4 text-amarelo"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.452 4.584 23.413l1.48-8.279L0 9.306l8.332-1.151z" />
        </svg>
        <svg
          className="absolute top-1/2 -right-10 w-6 h-6 text-amarelo"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.452 4.584 23.413l1.48-8.279L0 9.306l8.332-1.151z" />
        </svg>

        {/* Base */}
        <svg
          className="absolute -bottom-3 left-6 w-5 h-5 text-amarelo"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.452 4.584 23.413l1.48-8.279L0 9.306l8.332-1.151z" />
        </svg>
        <svg
          className="absolute -bottom-5 -right-4 w-4 h-4 text-amarelo"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.452 4.584 23.413l1.48-8.279L0 9.306l8.332-1.151z" />
        </svg>
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold italic text-azul mb-4 leading-tight">
        Boas-vindas,
        <br />
        <span className="text-coral">voluntário!</span>
      </h2>

      <p className="text-texto-medio text-base md:text-lg max-w-md mx-auto mb-8 leading-relaxed">
        Seu cadastro chegou aqui pra gente. Em breve entraremos em contato para contar como você pode caminhar com a gente. ✨
      </p>

      <div className="max-w-md mx-auto bg-offwhite rounded-2xl p-5 text-left">
        <p className="text-xs font-semibold text-azul mb-2 flex items-center gap-2">
          🔒 Seus dados estão seguros
        </p>
        <p className="text-xs text-texto-medio leading-relaxed">
          O Instituto Estrelar é o controlador dos seus dados pessoais e os utiliza apenas para coordenar atividades de voluntariado. Você pode solicitar exclusão a qualquer momento pelo e-mail{" "}
          <a
            href="mailto:comunicacao@institutoestrelar.com"
            className="text-azul font-medium underline hover:text-coral transition-colors"
          >
            comunicacao@institutoestrelar.com
          </a>
          .
        </p>
      </div>

      <p className="text-sm text-texto-medio mt-8">
        <em>Obrigada por dar esse passo.</em>
      </p>
    </div>
  );
}