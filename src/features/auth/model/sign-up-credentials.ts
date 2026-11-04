import type { LoginPayload } from '@entities/session';

// Почта и пароль из регистрации: после подтверждения почты входим сами,
// не заставляя набирать их ещё раз. Живут только в памяти — после
// перезапуска приложения человек входит на экране логина.
let pending: LoginPayload | null = null;

/** Запомнить данные успешной регистрации. */
export function rememberSignUp(credentials: LoginPayload) {
  pending = credentials;
}

/** Данные регистрации на эту почту или null, если их нет. */
export function signUpCredentials(email: string): LoginPayload | null {
  return pending?.email === email ? pending : null;
}

/** Забыть данные регистрации: вошли. */
export function forgetSignUp() {
  pending = null;
}
