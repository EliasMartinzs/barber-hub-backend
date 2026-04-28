export type ERROR_CODES = {
  USER_NOT_FOUND: string;
  FAILED_TO_CREATE_USER: string;
  FAILED_TO_CREATE_SESSION: string;
  FAILED_TO_UPDATE_USER: string;
  FAILED_TO_GET_SESSION: string;
  INVALID_PASSWORD: string;
  INVALID_EMAIL: string;
  INVALID_EMAIL_OR_PASSWORD: string;
  SOCIAL_ACCOUNT_ALREADY_LINKED: string;
  PROVIDER_NOT_FOUND: string;
  INVALID_TOKEN: string;
  ID_TOKEN_NOT_SUPPORTED: string;
  FAILED_TO_GET_USER_INFO: string;
  USER_EMAIL_NOT_FOUND: string;
  EMAIL_NOT_VERIFIED: string;
  PASSWORD_TOO_SHORT: string;
  PASSWORD_TOO_LONG: string;
  USER_ALREADY_EXISTS: string;
  EMAIL_CAN_NOT_BE_UPDATED: string;
  CREDENTIAL_ACCOUNT_NOT_FOUND: string;
  SESSION_EXPIRED: string;
  FAILED_TO_UNLINK_LAST_ACCOUNT: string;
  ACCOUNT_NOT_FOUND: string;
  USER_ALREADY_HAS_PASSWORD: string;
};

export const authErrorMap: Record<ERROR_CODES[keyof ERROR_CODES], string> = {
  USER_NOT_FOUND: 'Usuário não encontrado',
  FAILED_TO_CREATE_USER: 'Falha ao criar usuário',
  FAILED_TO_CREATE_SESSION: 'Falha ao criar sessão',
  FAILED_TO_UPDATE_USER: 'Falha ao atualizar usuário',
  FAILED_TO_GET_SESSION: 'Falha ao obter sessão',
  INVALID_PASSWORD: 'Senha inválida',
  INVALID_EMAIL: 'Email inválido',
  INVALID_EMAIL_OR_PASSWORD: 'Email ou senha inválidos',
  SOCIAL_ACCOUNT_ALREADY_LINKED: 'Conta social já vinculada',
  PROVIDER_NOT_FOUND: 'Provedor não encontrado',
  INVALID_TOKEN: 'Token inválido',
  ID_TOKEN_NOT_SUPPORTED: 'ID token não suportado',
  FAILED_TO_GET_USER_INFO: 'Falha ao obter informações do usuário',
  USER_EMAIL_NOT_FOUND: 'Email do usuário não encontrado',
  EMAIL_NOT_VERIFIED: 'Por favor verifique seu email',
  PASSWORD_TOO_SHORT: 'Senha muito curta',
  PASSWORD_TOO_LONG: 'Senha muito longa',
  USER_ALREADY_EXISTS: 'Usuário já existe',
  EMAIL_CAN_NOT_BE_UPDATED: 'Email não pode ser atualizado',
  CREDENTIAL_ACCOUNT_NOT_FOUND: 'Conta de credenciais não encontrada',
  SESSION_EXPIRED: 'Sessão expirada',
  FAILED_TO_UNLINK_LAST_ACCOUNT: 'Não foi possível desvincular a última conta',
  ACCOUNT_NOT_FOUND: 'Conta não encontrada',
  USER_ALREADY_HAS_PASSWORD: 'Usuário já possui senha',
};
