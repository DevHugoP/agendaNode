// Centralisé pour la gestion des erreurs d'auth
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_USED = 'EMAIL_ALREADY_USED',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  INVALID_TOKEN = 'INVALID_TOKEN',
  GENERIC = 'GENERIC',
  UNKNOWN = 'UNKNOWN',
}

export const authErrorMessages: Record<AuthErrorCode, string> = {
  [AuthErrorCode.INVALID_CREDENTIALS]: 'auth.invalidCredentials',
  [AuthErrorCode.USER_NOT_FOUND]: 'auth.userNotFound',
  [AuthErrorCode.EMAIL_ALREADY_USED]: 'auth.emailAlreadyUsed',
  [AuthErrorCode.WEAK_PASSWORD]: 'auth.weakPassword',
  [AuthErrorCode.INVALID_TOKEN]: 'auth.invalidToken',
  [AuthErrorCode.GENERIC]: 'auth.generic',
  [AuthErrorCode.UNKNOWN]: 'auth.unknown',
};
