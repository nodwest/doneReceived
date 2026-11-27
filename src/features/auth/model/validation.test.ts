import { describe, expect, it, vi } from 'vitest';
import {
  checkPasswordRules,
  validateEmail,
  validateLogin,
  validatePassword,
  validateRegistration,
} from './validation';

// Барабан сессии тянет хранилища; нужны только ограничения полей из API.
vi.mock(
  '@entities/session',
  () => import('../../../entities/session/model/rules'),
);

const STRONG = 'Secret#42';

describe('validateEmail', () => {
  it.each([
    ['', 'emailRequired'],
    ['   ', 'emailRequired'],
    ['emma', 'emailInvalid'],
    ['emma@mail', 'emailInvalid'],
    ['emma @mail.com', 'emailInvalid'],
    ['  emma@mail.com  ', undefined],
  ])('%j → %s', (email, error) => {
    expect(validateEmail(email)).toBe(error);
  });
});

describe('password rules', () => {
  const unmet = (password: string) =>
    checkPasswordRules(password)
      .filter(({ met }) => !met)
      .map(({ rule }) => rule);

  it('accepts a strong password', () => {
    expect(unmet(STRONG)).toEqual([]);
    expect(validatePassword(STRONG)).toBeUndefined();
  });

  it('lists every missing requirement', () => {
    expect(unmet('abc')).toEqual(['length', 'upper', 'digit', 'special']);
  });

  it('counts Cyrillic letters', () => {
    expect(unmet('Пароль#42')).toEqual([]);
  });

  it('keeps the API length limits 8–128', () => {
    expect(unmet('Ab#4567')).toEqual(['length']);
    expect(unmet('Ab#45678')).toEqual([]);
    expect(validatePassword(`Ab#4${'x'.repeat(125)}`)).toBe('passwordTooLong');
  });

  it('names the error for the field', () => {
    expect(validatePassword('')).toBe('passwordRequired');
    expect(validatePassword('password')).toBe('passwordWeak');
  });
});

describe('validateLogin', () => {
  it('only checks presence and API length, not strength', () => {
    expect(
      validateLogin({ email: 'emma@mail.com', password: 'password' }),
    ).toEqual({});
  });

  it('reports each field', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'emailRequired',
      password: 'passwordRequired',
    });
    expect(
      validateLogin({ email: 'emma@mail.com', password: 'short' }),
    ).toEqual({
      password: 'passwordTooShort',
    });
  });
});

describe('validateRegistration', () => {
  const form = {
    name: 'Sarah',
    email: 'sarah@mail.com',
    password: STRONG,
    confirmPassword: STRONG,
  };

  it('is empty for a valid form', () => {
    expect(validateRegistration(form)).toEqual({});
  });

  it('checks the name 1–100 after trimming', () => {
    expect(validateRegistration({ ...form, name: '  ' }).name).toBe(
      'nameRequired',
    );
    expect(validateRegistration({ ...form, name: 'a'.repeat(101) }).name).toBe(
      'nameTooLong',
    );
    expect(
      validateRegistration({ ...form, name: ` ${'a'.repeat(100)} ` }).name,
    ).toBeUndefined();
  });

  it('requires the same password twice', () => {
    expect(
      validateRegistration({ ...form, confirmPassword: 'Secret#43' }),
    ).toEqual({ confirmPassword: 'passwordsMismatch' });
  });
});
