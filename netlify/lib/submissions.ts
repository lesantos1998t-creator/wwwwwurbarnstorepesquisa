type Registration = {
  type: 'registration';
  values: {
    name: string;
    ageRange: string;
    gender: string;
    email: string;
    address: string;
    houseNumber: string;
    truthfulData: boolean;
    voluntaryParticipation: boolean;
    privacyConsent: boolean;
    academicUseConsent: boolean;
    consentVersion: string;
  };
};

type Submission = Registration
  | { type: 'rating'; values: { product: string; stars: number; comment: string } }
  | { type: 'feedback'; values: { email: string; message: string } };

function text(value: unknown, label: string, minimum: number, maximum: number): string {
  if (typeof value !== 'string' || value.trim().length < minimum || value.trim().length > maximum) {
    throw new Error(`${label}: informe entre ${minimum} e ${maximum} caracteres.`);
  }
  return value.trim();
}

function email(value: unknown): string {
  const address = text(value, 'E-mail', 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    throw new Error('Informe um e-mail válido.');
  }
  return address;
}

export function validateSubmission(payload: unknown): Submission {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Envio inválido.');
  }
  const fields = payload as Record<string, unknown>;

  if (fields.type === 'registration') {
    const ageRange = text(fields.ageRange, 'Faixa etária', 1, 20);
    const gender = text(fields.gender, 'Gênero', 1, 20);
    if (!['16–17', '18–24', '25–34', '35–44', '45–59', '60+'].includes(ageRange)) {
      throw new Error('Selecione uma faixa etária válida.');
    }
    if (!['feminino', 'masculino', 'nao-informar'].includes(gender)) {
      throw new Error('Selecione uma opção de gênero válida.');
    }
    if ([fields.truthfulData, fields.voluntaryParticipation, fields.privacyConsent, fields.academicUseConsent]
      .some(consent => consent !== true)) {
      throw new Error('Confirme todos os consentimentos obrigatórios.');
    }
    return {
      type: 'registration',
      values: {
        name: text(fields.name, 'Nome completo', 3, 200),
        ageRange,
        gender,
        email: email(fields.email),
        address: text(fields.address, 'Endereço', 3, 500),
        houseNumber: text(fields.houseNumber, 'Número da casa', 1, 30),
        truthfulData: true,
        voluntaryParticipation: true,
        privacyConsent: true,
        academicUseConsent: true,
        consentVersion: '2026-10-09',
      },
    };
  }

  if (fields.type === 'rating') {
    const product = text(fields.product, 'Produto', 1, 100);
    const products = [
      'Camiseta Urban Basic', 'Jaqueta Street Oversized', 'Moletom Urban Essential',
      'Calça Cargo City', 'Tênis Street Move', 'Boné Logo Central', 'Bolsa Crossbody Urban',
      'Óculos City Frame', 'Relógio Minimal Urban', 'Mochila Transit Daily', 'Conjunto Mini Street',
    ];
    if (!products.includes(product)) throw new Error('Selecione um produto do catálogo.');
    if (typeof fields.stars !== 'number' || !Number.isInteger(fields.stars) || fields.stars < 1 || fields.stars > 5) {
      throw new Error('Selecione uma nota de 1 a 5 estrelas.');
    }
    return {
      type: 'rating',
      values: { product, stars: fields.stars, comment: text(fields.comment, 'Comentário', 1, 5000) },
    };
  }

  if (fields.type === 'feedback') {
    return {
      type: 'feedback',
      values: { email: email(fields.email), message: text(fields.message, 'Mensagem', 1, 5000) },
    };
  }

  throw new Error('Tipo de envio inválido.');
}
