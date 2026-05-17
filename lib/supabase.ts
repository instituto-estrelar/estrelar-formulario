// ============================================================================
// Cliente Supabase para o Sistema-Estrelar
// ============================================================================
// Configura um cliente singleton do Supabase usando a anon key.
// A anon key é pública (vai pro browser) — segurança via RLS policies no banco.
// ============================================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Variaveis de ambiente do Supabase nao configuradas. " +
      "Verifique se .env.local tem NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,  // formulario publico nao precisa de sessao
  },
});

// URL da Edge Function de cadastro (montada a partir da URL do projeto)
export const CADASTRAR_VOLUNTARIO_URL = `${supabaseUrl}/functions/v1/cadastrar-voluntario`;