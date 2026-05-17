// ============================================================================
// Validadores do formulário de inscrição
// ============================================================================
// Migrado e expandido a partir do HTML inicial.
// Todos os validadores retornam { ok: boolean, msg?: string }.
// Sem dependência de React — testáveis isoladamente.
// ============================================================================

export interface ResultadoValidacao {
  ok: boolean;
  msg?: string;
}

// ----------------------------------------------------------------------------
// Nome completo
// ----------------------------------------------------------------------------

export function validarNome(v: string): ResultadoValidacao {
  const s = (v || "").trim();
  if (!s) return { ok: false, msg: "Conta pra gente seu nome." };
  if (s.length < 3)
    return { ok: false, msg: "Nome precisa ter pelo menos 3 letras." };
  if (s.length > 200)
    return { ok: false, msg: "Nome muito longo. Confere?" };
  // Tem que ter pelo menos um espaço (nome + sobrenome)
  if (!s.includes(" "))
    return { ok: false, msg: "Coloca seu nome completo, por favor." };
  return { ok: true };
}

// ----------------------------------------------------------------------------
// E-mail (RFC 5322 simplificada)
// ----------------------------------------------------------------------------

export function validarEmail(v: string): ResultadoValidacao {
  const s = (v || "").trim();
  if (!s) return { ok: false, msg: "Conta pra gente seu e-mail." };
  const re =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!re.test(s))
    return {
      ok: false,
      msg: "Esse e-mail parece incompleto. Confere se tá certinho?",
    };
  if (s.length > 254)
    return { ok: false, msg: "E-mail muito longo. Confere se tá certinho?" };
  if (s.includes(".."))
    return { ok: false, msg: "E-mail tem pontos seguidos — não pode." };
  return { ok: true };
}

// ----------------------------------------------------------------------------
// CPF — formato + dígitos verificadores
// ----------------------------------------------------------------------------

export function validarCpf(v: string): ResultadoValidacao {
  const s = (v || "").trim();
  if (!s) return { ok: false, msg: "Conta pra gente seu CPF." };

  // Formato xxx.xxx.xxx-xx
  if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(s)) {
    return { ok: false, msg: "CPF deve estar no formato 000.000.000-00." };
  }

  const numeros = s.replace(/\D/g, "");
  if (numeros.length !== 11) {
    return { ok: false, msg: "CPF inválido." };
  }

  // Rejeita CPFs com todos os dígitos iguais (111.111.111-11 etc)
  if (/^(\d)\1{10}$/.test(numeros)) {
    return { ok: false, msg: "CPF inválido." };
  }

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros[i]) * (10 - i);
  }
  let digito1 = 11 - (soma % 11);
  if (digito1 >= 10) digito1 = 0;
  if (digito1 !== parseInt(numeros[9])) {
    return { ok: false, msg: "CPF inválido. Confere?" };
  }

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros[i]) * (11 - i);
  }
  let digito2 = 11 - (soma % 11);
  if (digito2 >= 10) digito2 = 0;
  if (digito2 !== parseInt(numeros[10])) {
    return { ok: false, msg: "CPF inválido. Confere?" };
  }

  return { ok: true };
}

// Máscara de CPF — usada no onInput do campo
export function mascararCpf(v: string): string {
  const digitos = v.replace(/\D/g, "").slice(0, 11);
  return digitos
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

// ----------------------------------------------------------------------------
// Data de nascimento — idade 16-110 anos
// ----------------------------------------------------------------------------

export function validarNascimento(v: string): ResultadoValidacao {
  if (!v || typeof v !== "string")
    return { ok: false, msg: "Selecione sua data de nascimento." };

  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return { ok: false, msg: "Data inválida. Confere?" };

  const ano = parseInt(m[1], 10);
  const mes = parseInt(m[2], 10);
  const dia = parseInt(m[3], 10);

  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
    return { ok: false, msg: "Data inválida. Confere?" };
  }

  const data = new Date(ano, mes - 1, dia);
  if (
    data.getFullYear() !== ano ||
    data.getMonth() !== mes - 1 ||
    data.getDate() !== dia
  ) {
    return { ok: false, msg: "Essa data não existe. Confere?" };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (data > hoje)
    return { ok: false, msg: "A data parece estar no futuro. Confere?" };

  let idade = hoje.getFullYear() - ano;
  const monthDiff = hoje.getMonth() - (mes - 1);
  if (monthDiff < 0 || (monthDiff === 0 && hoje.getDate() < dia)) idade--;

  if (idade < 16)
    return {
      ok: false,
      msg: "Pra ser voluntário, você precisa ter pelo menos 16 anos.",
    };
  if (idade > 110)
    return { ok: false, msg: "Confere a data — parece um pouco antiga." };

  return { ok: true };
}

// ----------------------------------------------------------------------------
// Telefone celular brasileiro
// ----------------------------------------------------------------------------

// DDDs válidos no Brasil (67 códigos)
const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function validarCelular(v: string): ResultadoValidacao {
  const digitos = (v || "").replace(/\D/g, "");
  if (!digitos)
    return {
      ok: false,
      msg: "Coloca seu celular pra gente conseguir falar com você.",
    };
  if (digitos.length < 11)
    return { ok: false, msg: "Faltam alguns dígitos. Confere?" };
  if (digitos.length > 11)
    return { ok: false, msg: "Tem dígitos demais. Confere?" };

  const ddd = parseInt(digitos.substring(0, 2), 10);
  if (!DDDS_VALIDOS.has(ddd))
    return { ok: false, msg: "Esse DDD não parece existir. Confere?" };

  if (digitos[2] !== "9")
    return {
      ok: false,
      msg: "Celular brasileiro começa com 9 depois do DDD.",
    };

  // Evita números com todos os dígitos repetidos (depois do DDD)
  if (/^(\d)\1+$/.test(digitos.substring(2)))
    return { ok: false, msg: "Esse número não parece real. Confere?" };

  return { ok: true };
}

// Máscara de celular — formato (xx)9xxxx-xxxx
export function mascararCelular(v: string): string {
  const digitos = v.replace(/\D/g, "").slice(0, 11);

  if (digitos.length <= 2) return digitos.length > 0 ? `(${digitos}` : "";
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)})${digitos.slice(2)}`;
  return `(${digitos.slice(0, 2)})${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

// ----------------------------------------------------------------------------
// Texto livre com tamanho mínimo
// ----------------------------------------------------------------------------

export function validarTextoMinimo(
  v: string,
  minimo: number,
  nomeCampo = "Este campo"
): ResultadoValidacao {
  const s = (v || "").trim();
  if (!s)
    return { ok: false, msg: `${nomeCampo} é obrigatório.` };
  if (s.length < minimo)
    return {
      ok: false,
      msg: `${nomeCampo} precisa ter pelo menos ${minimo} caracteres.`,
    };
  return { ok: true };
}

// ----------------------------------------------------------------------------
// Lista não vazia (pra multi-select)
// ----------------------------------------------------------------------------

export function validarSelecaoMinima<T>(
  lista: T[],
  nomeCampo = "Esta seleção"
): ResultadoValidacao {
  if (!Array.isArray(lista) || lista.length === 0)
    return { ok: false, msg: `${nomeCampo} precisa ter pelo menos 1 item.` };
  return { ok: true };
}