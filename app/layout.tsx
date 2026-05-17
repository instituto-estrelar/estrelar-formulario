import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vem caminhar com a gente — Instituto Estrelar",
  description:
    "Cadastre-se como voluntário do Instituto Estrelar e ajude a transformar a vida de crianças e adolescentes no Espírito Santo.",
  openGraph: {
    title: "Vem caminhar com a gente — Instituto Estrelar",
    description:
      "Cadastre-se como voluntário do Instituto Estrelar.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}