// ============================================================================
// Tipos compartilhados do Sistema-Estrelar
// ============================================================================

export interface AreaAtuacao {
  id: string;
  nome: string;
  descricao: string | null;
  ordem: number;
  ativa: boolean;
}

export interface CidadeAtendida {
  id: string;
  nome: string;
  estado: string;
  ordem: number;
  ativa: boolean;
}

export type DiaSemana =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";

export type TurnoDia = "manha" | "tarde" | "noite";

// Payload enviado para a Edge Function cadastrar-voluntario
export interface PayloadCadastro {
  nome_completo: string;
  cpf: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  cidade_residencia: string;
  motivo_voluntariado: string;
  descricao_utilidade: string;
  habilidades_livres?: string;
  area_outro_descricao?: string;
  area_ids: string[];
  dias: DiaSemana[];
  turnos: TurnoDia[];
  cidade_ids: string[];
}

// Resposta da Edge Function em caso de sucesso
export interface RespostaSucesso {
  sucesso: true;
  voluntario_id: string;
  mensagem: string;
}

// Resposta em caso de erro
export interface RespostaErro {
  sucesso: false;
  erro: string;
  detalhes?: string[];
  codigo?: "VALIDACAO" | "DUPLICATA_CPF" | "DUPLICATA_EMAIL" | "INTERNO";
}

export type RespostaCadastro = RespostaSucesso | RespostaErro;