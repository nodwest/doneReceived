import {
  DISPLAY_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@entities/session';

/** Ошибка поля формы — ключ в разделе `auth.errors` словаря. */
export type FieldError =
  | 'nameRequired'
  | 'nameTooLong'
  | 'emailRequired'
  | 'emailInvalid'
  | 'passwordRequired'
  | 'passwordTooShort'
  | 'passwordTooLong'
  | 'passwordWeak'
  | 'passwordsMismatch';

export type RegistrationForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegistrationErrors = Partial<
  Record<keyof RegistrationForm, FieldError>
>;

// Простая проверка вида «что-то@что-то.что-то»: остальное проверит сервер.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): FieldError | undefined {
  const value = email.trim();
  if (!value) return 'emailRequired';
  if (!EMAIL_PATTERN.test(value)) return 'emailInvalid';
}

/** Требование к новому паролю — ключ в разделе `auth.passwordRules`. */
export type PasswordRule = 'length' | 'upper' | 'lower' | 'digit' | 'special';

// API требует только длину 8–128; остальное — наше требование к надёжности.
// Буквы любого алфавита: кириллица тоже считается.
const PASSWORD_RULES: Record<PasswordRule, (password: string) => boolean> = {
  length: (p) =>
    p.length >= PASSWORD_MIN_LENGTH && p.length <= PASSWORD_MAX_LENGTH,
  upper: (p) => /\p{Lu}/u.test(p),
  lower: (p) => /\p{Ll}/u.test(p),
  digit: (p) => /\p{N}/u.test(p),
  special: (p) => /[^\p{L}\p{N}\s]/u.test(p),
};

/** Каждое требование к паролю и выполнено ли оно — для подсказки под полем. */
export function checkPasswordRules(
  password: string,
): { rule: PasswordRule; met: boolean }[] {
  return (Object.keys(PASSWORD_RULES) as PasswordRule[]).map((rule) => ({
    rule,
    met: PASSWORD_RULES[rule](password),
  }));
}

/** Новый пароль: длина по правилам API и все требования к надёжности. */
export function validatePassword(password: string): FieldError | undefined {
  if (!password) return 'passwordRequired';
  if (password.length > PASSWORD_MAX_LENGTH) return 'passwordTooLong';
  if (checkPasswordRules(password).some(({ met }) => !met)) {
    return 'passwordWeak';
  }
}

export type LoginForm = {
  email: string;
  password: string;
};

export type LoginErrors = Partial<Record<keyof LoginForm, FieldError>>;

/** Ошибки формы логина: у API пароль тоже не короче 8 символов. */
export function validateLogin(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};
  const email = validateEmail(form.email);
  if (email) errors.email = email;
  if (!form.password) errors.password = 'passwordRequired';
  else if (form.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = 'passwordTooShort';
  }
  return errors;
}

/** Ошибки формы регистрации; пустой объект — можно отправлять. */
export function validateRegistration(
  form: RegistrationForm,
): RegistrationErrors {
  const errors: RegistrationErrors = {};
  const name = form.name.trim();
  if (!name) errors.name = 'nameRequired';
  else if (name.length > DISPLAY_NAME_MAX_LENGTH) errors.name = 'nameTooLong';

  const email = validateEmail(form.email);
  if (email) errors.email = email;

  const password = validatePassword(form.password);
  if (password) errors.password = password;

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'passwordsMismatch';
  }
  return errors;
}
