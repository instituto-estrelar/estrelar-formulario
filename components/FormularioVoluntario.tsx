"use client";

import { useState, useEffect, useRef } from "react";
import { CADASTRAR_VOLUNTARIO_URL } from "@/lib/supabase";
import {
  AreaAtuacao,
  CidadeAtendida,
  DiaSemana,
  TurnoDia,
  PayloadCadastro,
  RespostaCadastro,
} from "@/lib/types";
import {
  validarNome,
  validarEmail,
  validarCpf,
  validarNascimento,
  validarCelular,
  validarTextoMinimo,
  validarSelecaoMinima,
  mascararCpf,
  mascararCelular,
} from "@/lib/validators";
import {
  FormField,
  inputClass,
  inputErrorClass,
} from "./FormField";
import { MultiSelect, MultiSelectOption } from "./MultiSelect";
import { Banner } from "./Banner";
import { SuccessScreen } from "./SuccessScreen";
import { MUNICIPIOS_ES, OPCAO_OUTRA_CIDADE } from "@/lib/cidades-es";

interface Props {
  areas: AreaAtuacao[];
  cidades: CidadeAtendida[];
}

// Opções fixas de dias da semana e turnos
const OPCOES_DIAS: MultiSelectOption[] = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
  { value: "sabado", label: "Sábado" },
];

const OPCOES_TURNOS: MultiSelectOption[] = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
];

// Opções de cidades onde mora: 78 municipios do ES + "Outra cidade"
const OPCOES_CIDADES_MORADIA: MultiSelectOption[] = [
  ...MUNICIPIOS_ES.map((nome) => ({ value: nome, label: nome })),
  { value: OPCAO_OUTRA_CIDADE, label: OPCAO_OUTRA_CIDADE },
];

// Chave do localStorage pro rascunho
const LS_KEY = "estrelar-rascunho-voluntario-v1";

// Estado inicial vazio
const ESTADO_INICIAL = {
  nome: "",
  cpf: "",
  email: "",
  telefone: "",
  data_nascimento: "",
  cidade_residencia: "",
  cidade_residencia_outra: "",
  motivo: "",
  utilidade: "",
  habilidades: "",
  areas: [] as string[],     // IDs das áreas
  areaOutro: "",
  dias: [] as string[],      // valores dos dias
  turnos: [] as string[],    // valores dos turnos
  cidades: [] as string[],   // IDs das cidades
};

type EstadoForm = typeof ESTADO_INICIAL;

export function FormularioVoluntario({ areas, cidades }: Props) {
  const [form, setForm] = useState<EstadoForm>(ESTADO_INICIAL);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erroSubmit, setErroSubmit] = useState<string | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Identifica se "Outro" está selecionado nas áreas
  // (procuramos uma área cujo nome contém "outro"; se não existir, ignoramos)
  const areaOutroId = areas.find((a) =>
    a.nome.toLowerCase().includes("outro")
  )?.id;
  const mostrarOutro = areaOutroId
    ? form.areas.includes(areaOutroId)
    : false;

  // -------------------------------------------------------------------------
  // Auto-save: carrega rascunho ao montar
  // -------------------------------------------------------------------------
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(LS_KEY);
      if (salvo) {
        const dados = JSON.parse(salvo);
        // Validação básica do shape
        if (typeof dados === "object" && dados !== null) {
          setForm({ ...ESTADO_INICIAL, ...dados });
        }
      }
    } catch {
      // localStorage indisponível ou JSON inválido — silenciosamente ignora
    }
  }, []);

  // -------------------------------------------------------------------------
  // Auto-save: salva rascunho a cada mudança (com debounce)
  // -------------------------------------------------------------------------
  useEffect(() => {
    // Só salva se o form não está vazio (evita escrita inútil)
    const temConteudo =
      form.nome || form.email || form.cpf || form.motivo ||
      form.areas.length > 0;
    if (!temConteudo) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(form));
      } catch {
        // Quota cheia ou storage bloqueado — ignora
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form]);

  // -------------------------------------------------------------------------
  // Helpers de update
  // -------------------------------------------------------------------------
  function atualizar<K extends keyof EstadoForm>(
    campo: K,
    valor: EstadoForm[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    // Limpa erro deste campo ao editar
    if (erros[campo]) {
      setErros((prev) => {
        const novo = { ...prev };
        delete novo[campo];
        return novo;
      });
    }
  }

  // -------------------------------------------------------------------------
  // Validação completa
  // -------------------------------------------------------------------------
  function validarTudo(): { valido: boolean; novosErros: Record<string, string> } {
    const novosErros: Record<string, string> = {};

    const rNome = validarNome(form.nome);
    if (!rNome.ok) novosErros.nome = rNome.msg!;

    const rCpf = validarCpf(form.cpf);
    if (!rCpf.ok) novosErros.cpf = rCpf.msg!;

    const rEmail = validarEmail(form.email);
    if (!rEmail.ok) novosErros.email = rEmail.msg!;

    const rCel = validarCelular(form.telefone);
    if (!rCel.ok) novosErros.telefone = rCel.msg!;

    const rNasc = validarNascimento(form.data_nascimento);
    if (!rNasc.ok) novosErros.data_nascimento = rNasc.msg!;

    if (!form.cidade_residencia) {
      novosErros.cidade_residencia = "Selecione sua cidade.";
    } else if (form.cidade_residencia === OPCAO_OUTRA_CIDADE) {
      const rOutra = validarTextoMinimo(
        form.cidade_residencia_outra,
        2,
        "Cidade"
      );
      if (!rOutra.ok) {
        novosErros.cidade_residencia_outra = rOutra.msg!;
      }
    }

    const rMotivo = validarTextoMinimo(form.motivo, 10, "Motivo");
    if (!rMotivo.ok) novosErros.motivo = rMotivo.msg!;

    // utilidade é opcional; se preenchida, valida tamanho mínimo
    if (form.utilidade.trim().length > 0) {
      const rUtil = validarTextoMinimo(form.utilidade, 3, "Descrição");
      if (!rUtil.ok) novosErros.utilidade = rUtil.msg!;
    }

    const rAreas = validarSelecaoMinima(form.areas, "Áreas");
    if (!rAreas.ok) novosErros.areas = rAreas.msg!;
    else if (mostrarOutro && !form.areaOutro.trim()) {
      novosErros.areaOutro = "Conta qual área é essa.";
    }

    const rDias = validarSelecaoMinima(form.dias, "Dias");
    if (!rDias.ok) novosErros.dias = rDias.msg!;

    const rTurnos = validarSelecaoMinima(form.turnos, "Turnos");
    if (!rTurnos.ok) novosErros.turnos = rTurnos.msg!;

    const rCidades = validarSelecaoMinima(form.cidades, "Cidades de atuação");
    if (!rCidades.ok) novosErros.cidades = rCidades.msg!;

    return { valido: Object.keys(novosErros).length === 0, novosErros };
  }

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroSubmit(null);

    const { valido, novosErros } = validarTudo();
    setErros(novosErros);

    if (!valido) {
      // Scroll suave até o banner de alerta no topo do form
      bannerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setEnviando(true);

    // Monta payload pra Edge Function
    const areaIdsLimpos = form.areas.filter((id) => id !== areaOutroId);
    const payload: PayloadCadastro = {
      nome_completo: form.nome.trim(),
      cpf: form.cpf,
      email: form.email.trim(),
      telefone: form.telefone,
      data_nascimento: form.data_nascimento,
      cidade_residencia:
        form.cidade_residencia === OPCAO_OUTRA_CIDADE
          ? form.cidade_residencia_outra.trim()
          : form.cidade_residencia,
      motivo_voluntariado: form.motivo.trim(),
      // utilidade é opcional — manda undefined se vazio pra Edge Function tratar como ausente
      descricao_utilidade: form.utilidade.trim() || undefined,
      habilidades_livres: form.habilidades.trim() || undefined,
      area_outro_descricao:
        mostrarOutro && form.areaOutro.trim()
          ? form.areaOutro.trim()
          : undefined,
      area_ids: areaIdsLimpos,
      dias: form.dias as DiaSemana[],
      turnos: form.turnos as TurnoDia[],
      cidade_ids: form.cidades,
    };

    try {
      const resp = await fetch(CADASTRAR_VOLUNTARIO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const dados: RespostaCadastro = await resp.json();

      if (dados.sucesso) {
        // Limpa o rascunho
        try {
          localStorage.removeItem(LS_KEY);
        } catch {}
        setSucesso(true);
        // Scroll pra cima pra mostrar a tela de sucesso
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Mensagens específicas por código
        if (dados.codigo === "DUPLICATA_CPF") {
          setErros({ cpf: dados.erro });
          setErroSubmit(dados.erro);
        } else if (dados.codigo === "DUPLICATA_EMAIL") {
          setErros({ email: dados.erro });
          setErroSubmit(dados.erro);
        } else {
          setErroSubmit(
            dados.erro +
              (dados.detalhes ? ": " + dados.detalhes.join(", ") : "")
          );
        }
        bannerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } catch (err) {
      console.error("Erro de rede:", err);
      setErroSubmit(
        "Não conseguimos enviar agora. Confere sua internet e tenta de novo, por favor."
      );
    } finally {
      setEnviando(false);
    }
  }

  // Se já enviou com sucesso, mostra só a tela de sucesso
  if (sucesso) return <SuccessScreen />;

  // -------------------------------------------------------------------------
  // Opções pros MultiSelect (áreas e cidades vêm do banco)
  // -------------------------------------------------------------------------
  const opcoesAreas: MultiSelectOption[] = areas.map((a) => ({
    value: a.id,
    label: a.nome,
    description: a.descricao || undefined,
  }));

  const opcoesCidades: MultiSelectOption[] = cidades.map((c) => ({
    value: c.id,
    label: c.nome,
  }));

  const numErros = Object.keys(erros).length;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Cabeçalho do formulário (some quando vai pra tela de sucesso) */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-azul mb-2">
          Inscrição de voluntário
        </h2>
        <p className="text-sm text-texto-medio">
          Os campos com <span className="text-coral font-semibold">*</span> são obrigatórios.
        </p>
      </div>

      <div ref={bannerRef}>
        <Banner numErrors={numErros} visible={numErros > 0} />
      </div>

      {/* Erro de submit (rede ou erro inesperado) */}
      {erroSubmit && numErros === 0 && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-coral/10 border border-coral text-coral text-sm"
        >
          {erroSubmit}
        </div>
      )}

      {/* Nome */}
      <FormField label="Seu nome completo" required error={erros.nome}>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => atualizar("nome", e.target.value)}
          placeholder="Como você se chama?"
          className={erros.nome ? inputErrorClass : inputClass}
          autoComplete="name"
        />
      </FormField>

      {/* CPF */}
      <FormField
        label="CPF"
        required
        hint="🔒 Usado apenas para evitar cadastros duplicados. Seu CPF nunca sai do nosso sistema — armazenamos apenas uma identificação criptografada (LGPD)."
        error={erros.cpf}
      >
        <input
          type="text"
          value={form.cpf}
          onChange={(e) => atualizar("cpf", mascararCpf(e.target.value))}
          placeholder="000.000.000-00"
          inputMode="numeric"
          maxLength={14}
          className={erros.cpf ? inputErrorClass : inputClass}
        />
      </FormField>

      {/* E-mail */}
      <FormField label="E-mail" required error={erros.email}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => atualizar("email", e.target.value)}
          placeholder="seuemail@exemplo.com"
          className={erros.email ? inputErrorClass : inputClass}
          autoComplete="email"
        />
      </FormField>

      {/* Data de nascimento */}
      <FormField
        label="Data de nascimento"
        required
        error={erros.data_nascimento}
      >
        <input
          type="date"
          value={form.data_nascimento}
          onChange={(e) => atualizar("data_nascimento", e.target.value)}
          className={erros.data_nascimento ? inputErrorClass : inputClass}
        />
      </FormField>

      {/* Telefone */}
      <FormField
        label="Celular (WhatsApp)"
        required
        error={erros.telefone}
      >
        <input
          type="tel"
          value={form.telefone}
          onChange={(e) =>
            atualizar("telefone", mascararCelular(e.target.value))
          }
          placeholder="(00)90000-0000"
          inputMode="numeric"
          maxLength={14}
          className={erros.telefone ? inputErrorClass : inputClass}
          autoComplete="tel"
        />
      </FormField>

      {/* Cidade onde mora — dropdown com municipios do ES */}
      <FormField
        label="Qual cidade você mora?"
        required
        error={erros.cidade_residencia}
      >
        <select
          value={form.cidade_residencia}
          onChange={(e) => {
            atualizar("cidade_residencia", e.target.value);
            // Limpa o campo "outra" se trocar pra uma cidade da lista
            if (e.target.value !== OPCAO_OUTRA_CIDADE) {
              atualizar("cidade_residencia_outra", "");
            }
          }}
          className={erros.cidade_residencia ? inputErrorClass : inputClass}
        >
          <option value="">Selecione sua cidade...</option>
          {MUNICIPIOS_ES.map((cidade) => (
            <option key={cidade} value={cidade}>
              {cidade}
            </option>
          ))}
          <option value={OPCAO_OUTRA_CIDADE}>
            {OPCAO_OUTRA_CIDADE}
          </option>
        </select>
      </FormField>

      {/* Campo de texto livre que aparece só se selecionar "Outra cidade" */}
      {form.cidade_residencia === OPCAO_OUTRA_CIDADE && (
        <FormField
          label="Em qual cidade você mora?"
          required
          hint="Digite o nome completo da cidade e estado (ex: Rio de Janeiro — RJ)"
          error={erros.cidade_residencia_outra}
        >
          <input
            type="text"
            value={form.cidade_residencia_outra}
            onChange={(e) =>
              atualizar("cidade_residencia_outra", e.target.value)
            }
            placeholder="Cidade — Estado"
            className={
              erros.cidade_residencia_outra ? inputErrorClass : inputClass
            }
            autoComplete="address-level2"
          />
        </FormField>
      )}

      {/* Motivo */}
      <FormField
        label="Por que você quer ser voluntário?"
        required
        error={erros.motivo}
      >
        <textarea
          value={form.motivo}
          onChange={(e) => atualizar("motivo", e.target.value)}
          placeholder="O que te trouxe até aqui?"
          rows={3}
          className={`${
            erros.motivo ? inputErrorClass : inputClass
          } resize-none`}
        />
      </FormField>

      {/* Áreas de atuação — vem PRIMEIRO agora (era depois do textarea de utilidade) */}
      <FormField
        label="Em que área e como você acha que poderia ser útil?"
        required
        error={erros.areas}
      >
        <MultiSelect
          options={opcoesAreas}
          selected={form.areas}
          onChange={(v) => atualizar("areas", v)}
          placeholder="Toque pra ver as áreas"
          error={Boolean(erros.areas)}
        />
      </FormField>

      {/* Outro (aparece só se "Outro" estiver selecionado) */}
      {mostrarOutro && (
        <FormField
          label="Conta qual outra área é essa"
          required
          error={erros.areaOutro}
        >
          <input
            type="text"
            value={form.areaOutro}
            onChange={(e) => atualizar("areaOutro", e.target.value)}
            placeholder="Ex.: marcenaria, música, jardinagem…"
            className={erros.areaOutro ? inputErrorClass : inputClass}
          />
        </FormField>
      )}

      {/* Descrição opcional sobre subnicho — agora vem DEPOIS das áreas, opcional, curto */}
      <FormField
        label="Descreva brevemente o que espera atuando nessa área"
        hint="Opcional, mas ajuda muito! Ex.: dentro de 'Comunicação', você prefere fotografia? Em 'dar aula', tem alguma matéria favorita?"
        error={erros.utilidade}
      >
        <textarea
          value={form.utilidade}
          onChange={(e) => atualizar("utilidade", e.target.value)}
          placeholder="Pode ser bem curtinho..."
          rows={2}
          className={`${
            erros.utilidade ? inputErrorClass : inputClass
          } resize-none`}
        />
      </FormField>

      {/* Dias */}
      <FormField
        label="Quais os melhores dias da semana?"
        required
        error={erros.dias}
      >
        <MultiSelect
          options={OPCOES_DIAS}
          selected={form.dias}
          onChange={(v) => atualizar("dias", v)}
          placeholder="Toque pra escolher"
          error={Boolean(erros.dias)}
        />
      </FormField>

      {/* Turnos */}
      <FormField
        label="Quais os melhores horários pra você?"
        required
        error={erros.turnos}
      >
        <MultiSelect
          options={OPCOES_TURNOS}
          selected={form.turnos}
          onChange={(v) => atualizar("turnos", v)}
          placeholder="Manhã, tarde ou noite"
          error={Boolean(erros.turnos)}
        />
      </FormField>

      {/* Cidades de atuação */}
      <FormField
        label="Em qual cidade você gostaria de estar junto da gente?"
        required
        error={erros.cidades}
      >
        <MultiSelect
          options={opcoesCidades}
          selected={form.cidades}
          onChange={(v) => atualizar("cidades", v)}
          placeholder="Toque pra escolher"
          error={Boolean(erros.cidades)}
        />
      </FormField>

      {/* Habilidades livres (opcional) */}
      <FormField
        label="Tem alguma habilidade que não citamos aqui?"
        hint="Pode contar tudo — quanto mais soubermos sobre você, melhor."
      >
        <textarea
          value={form.habilidades}
          onChange={(e) => atualizar("habilidades", e.target.value)}
          placeholder="Tudo que souber fazer pode brilhar aqui…"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </FormField>

      {/* Botão submit */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={enviando}
          className="
            w-full py-4 px-6 rounded-2xl
            bg-azul text-white font-bold text-lg
            transition-all duration-200
            hover:bg-azul-dark hover:shadow-lg
            disabled:opacity-60 disabled:cursor-not-allowed
            focus:outline-none focus:ring-4 focus:ring-azul/30
          "
        >
          {enviando ? "Enviando..." : "Quero fazer parte ✨"}
        </button>
      </div>
    </form>
  );
}
