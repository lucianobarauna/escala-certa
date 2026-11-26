import type { ConfigIssue, ConfigIssueCode } from '@/types/schedule';

import { MAX_NAME_LENGTH } from './schedule.constants';

const FIELD_MESSAGES: Record<string, string> = {
  t: 'O tipo de escala do link é inválido e foi ignorado.',
  c: 'A escala do link é inválida e foi ignorada.',
  s: 'O turno do link é inválido e foi ignorado.',
  d: 'A data de referência do link é inválida e foi ignorada.',
  m: 'A modalidade do link é inválida e foi ignorada.',
  w: 'A quantidade de semanas do link é inválida e foi ignorada.',
  p: 'O padrão de folgas do link é inconsistente e foi ignorado.',
};

const UNKNOWN_VERSION_MESSAGE =
  'Este link foi criado por uma versão que não reconhecemos. Configure a escala novamente.';

const NAME_TRUNCATED_MESSAGE = `O nome do link tinha mais de ${MAX_NAME_LENGTH} caracteres e foi cortado.`;

export function createFieldIssue(code: ConfigIssueCode, field: string): ConfigIssue {
  return { code, field, message: FIELD_MESSAGES[field] };
}

export function createUnknownVersionIssue(): ConfigIssue {
  return { code: 'unknown_version', message: UNKNOWN_VERSION_MESSAGE };
}

export function createNameTruncatedIssue(): ConfigIssue {
  return { code: 'name_truncated', field: 'n', message: NAME_TRUNCATED_MESSAGE };
}
