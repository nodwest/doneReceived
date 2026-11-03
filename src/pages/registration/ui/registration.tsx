import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  FieldHint,
  PasswordRules,
  requestError,
  useRegister,
  validateRegistration,
  type HintTone,
  type RegistrationForm,
} from '@features/auth';
import { useTranslation } from '@shared/i18n';
import {
  AuthFootnote,
  AuthLayout,
  GradientButton,
  InputWithIcon,
  Label,
} from '@shared/ui';
import { styles } from './registration.styled';

type Field = keyof RegistrationForm;

const EMPTY_FORM: RegistrationForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/**
 * Регистрация родителя: имя, почта, пароль с повтором, ссылка на логин.
 * Под каждым полем подсказка: синяя — что нужно (появляется с фокусом),
 * зелёная с галочкой — поле заполнено верно, красная — ошибка. Ошибка
 * видна, когда из заполненного поля ушли или нажали «Create Account»; пока
 * человек печатает, его не ругаем. У пароля — список требований, повтор
 * пароля краснеет сразу, как только уже не может совпасть. После успеха —
 * экран подтверждения почты.
 */
export function Registration() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<Field | null>(null);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const { mutate, isPending, error, reset } = useRegister();

  const errors = validateRegistration(form);

  const showError = (field: Field) => {
    if (!errors[field]) return false;
    if (submitted) return true;
    const value = form[field];
    if (!value) return false;
    // Повтор не совпадает, а набран уже не короче пароля — сказать сразу.
    if (field === 'confirmPassword' && value.length >= form.password.length) {
      return true;
    }
    return !!touched[field] && focused !== field;
  };

  /** Подсказка под полем: тон и текст, или null — ничего не показываем. */
  const hint = (
    field: Exclude<Field, 'password'>,
  ): { tone: HintTone; text: string } | null => {
    const fieldError = errors[field];
    if (showError(field) && fieldError) {
      return { tone: 'error', text: t(`auth.errors.${fieldError}`) };
    }
    const text = t(`auth.hints.${field}`);
    if (form[field] && !fieldError) return { tone: 'met', text };
    if (focused === field || form[field]) return { tone: 'hint', text };
    return null;
  };

  const showRules =
    focused === 'password' || !!form.password || showError('password');

  const set = (field: Field) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Поле поменяли — прошлая ошибка сервера больше не про эти данные.
    if (error) reset();
  };

  const focus = (field: Field) => ({
    onFocus: () => setFocused(field),
    onBlur: () => {
      setFocused(null);
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
  });

  const submit = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    const email = form.email.trim();
    mutate(
      { displayName: form.name.trim(), email, password: form.password },
      {
        onSuccess: () =>
          router.push({ pathname: '/verify-email', params: { email } }),
      },
    );
  };

  const renderHint = (field: Exclude<Field, 'password'>) => {
    const value = hint(field);
    return value && <FieldHint {...value} />;
  };

  return (
    <AuthLayout
      icon="star"
      title={t('auth.registrationTitle')}
      subtitle={t('auth.registrationSubtitle')}
      action={
        <View style={styles.action}>
          {error && (
            <Text style={[styles.error, styles.requestError]}>
              {t(`auth.requestErrors.${requestError(error, 'emailTaken')}`)}
            </Text>
          )}
          <GradientButton
            label={t('auth.createAccount')}
            onPress={submit}
            disabled={isPending}
          />
        </View>
      }
      footnote={
        <AuthFootnote
          text={t('auth.haveAccount')}
          linkLabel={t('auth.logIn')}
          href="/login"
        />
      }
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <Label htmlFor="name" style={styles.label}>
            {t('auth.fullName')}
          </Label>
          <InputWithIcon
            id="name"
            placeholder={t('auth.fullName')}
            iconName="user"
            value={form.name}
            onChangeText={set('name')}
            {...focus('name')}
            error={showError('name')}
            autoComplete="name"
            textContentType="name"
          />
          {renderHint('name')}
        </View>
        <View style={styles.field}>
          <Label htmlFor="email" style={styles.label}>
            {t('auth.email')}
          </Label>
          <InputWithIcon
            id="email"
            placeholder={t('auth.email')}
            iconName="message"
            value={form.email}
            onChangeText={set('email')}
            {...focus('email')}
            error={showError('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
          {renderHint('email')}
        </View>
        <View style={styles.field}>
          <Label htmlFor="password" style={styles.label}>
            {t('auth.password')}
          </Label>
          <InputWithIcon
            secureTextEntry={true}
            id="password"
            placeholder={t('auth.password')}
            iconName="castle"
            value={form.password}
            onChangeText={set('password')}
            {...focus('password')}
            error={showError('password')}
            autoComplete="new-password"
            textContentType="newPassword"
          />
          {showRules && (
            <PasswordRules
              password={form.password}
              error={showError('password')}
            />
          )}
        </View>
        <View style={styles.field}>
          <Label htmlFor="confirm-password" style={styles.label}>
            {t('auth.confirmPassword')}
          </Label>
          <InputWithIcon
            secureTextEntry={true}
            id="confirm-password"
            placeholder={t('auth.confirmPassword')}
            iconName="castle"
            value={form.confirmPassword}
            onChangeText={set('confirmPassword')}
            {...focus('confirmPassword')}
            error={showError('confirmPassword')}
            autoComplete="new-password"
            textContentType="newPassword"
          />
          {renderHint('confirmPassword')}
        </View>
      </View>
    </AuthLayout>
  );
}
