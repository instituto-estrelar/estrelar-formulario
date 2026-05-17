// ============================================================================
// Busca de áreas de atuação e cidades atendidas (server-side)
// ============================================================================
// Esta função roda no servidor (server component) com ISR de 60s.
// Refresh automático: quando a dona adicionar área pelo painel admin,
// em até 60s aparece no formulário sem precisar de novo deploy.
// ============================================================================

import { supabase } from "./supabase";
import { AreaAtuacao, CidadeAtendida } from "./types";

export interface DadosBase {
  areas: AreaAtuacao[];
  cidades: CidadeAtendida[];
}

export async function getDadosBase(): Promise<DadosBase> {
  const [areasResult, cidadesResult] = await Promise.all([
    supabase
      .from("areas_atuacao")
      .select("id, nome, descricao, ordem, ativa")
      .eq("ativa", true)
      .order("ordem"),
    supabase
      .from("cidades_atendidas")
      .select("id, nome, estado, ordem, ativa")
      .eq("ativa", true)
      .order("ordem"),
  ]);

  if (areasResult.error) {
    console.error("Erro ao buscar areas:", areasResult.error);
    throw new Error("Nao foi possivel carregar as areas de atuacao.");
  }

  if (cidadesResult.error) {
    console.error("Erro ao buscar cidades:", cidadesResult.error);
    throw new Error("Nao foi possivel carregar as cidades.");
  }

  return {
    areas: areasResult.data || [],
    cidades: cidadesResult.data || [],
  };
}