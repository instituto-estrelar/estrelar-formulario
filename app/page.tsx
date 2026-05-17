import Image from "next/image";
import { getDadosBase } from "@/lib/areas-cidades";
import { FormularioVoluntario } from "@/components/FormularioVoluntario";

// ISR: revalida a cada 60 segundos
export const revalidate = 60;

export default async function Home() {
  const { areas, cidades } = await getDadosBase();

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-azul text-white py-16 px-6 pb-28 text-center">
        {/* Blobs decorativos */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute rounded-full"
            style={{
              top: "-40px",
              left: "-60px",
              width: "220px",
              height: "220px",
              background: "var(--color-turquesa)",
              opacity: 0.18,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: "40px",
              right: "-80px",
              width: "280px",
              height: "280px",
              background: "var(--color-coral)",
              opacity: 0.12,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: "40%",
              right: "20%",
              width: "90px",
              height: "90px",
              background: "var(--color-amarelo)",
              opacity: 0.18,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          {/* LOGO — adicionado */}
          <div className="mb-8 inline-block">
            <Image
              src="/logo-branca.png"
              alt="Instituto Estrelar"
              width={200}
              height={100}
              priority
              className="h-auto w-40 md:w-48 mx-auto"
            />
          </div>

          <h1 className="font-extrabold italic text-4xl md:text-6xl leading-tight mb-6">
            Vem caminhar
            <br />
            <span className="text-amarelo">com a gente</span>
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-xl mx-auto">
            Conta pra gente quem você é e como pode fazer parte.
          </p>
        </div>
      </section>

      {/* CARD DO FORMULÁRIO */}
      <section className="px-6 -mt-16 pb-20 relative z-20">
        <div className="mx-auto max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-xl">
          <FormularioVoluntario areas={areas} cidades={cidades} />
        </div>
      </section>

      {/* Rodapé simples */}
      <footer className="text-center text-sm text-texto-medio py-8 px-6">
        © Instituto Estrelar — feito com cuidado
      </footer>
    </main>
  );
}