import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  requestError,
  useLogin,
  validateLogin,
  type FieldError,
  type LoginForm,
} from '@features/auth';
import { useTranslation } from '@shared/i18n';
import {
  AuthFootnote,
  AuthLayout,
  GradientButton,
  InputWithIcon,
  Label,
} from '@shared/ui';
import { styles } from './login.styled';

/**
 * Логин родителя: почта и пароль, ссылка на регистрацию. `?email=` —
 * подставить почту (после подтверждения). Ошибки полей — после первой
 * попытки войти; после входа — главная.
 */
export function Login() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ email?: string }>();
  const [form, setForm] = useState<LoginForm>({
    email: params.email ?? '',
    password: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const { mutate, isPending, error, reset } = useLogin();

  const errors = validateLogin(form);
  const shown = submitted ? errors : {};
  const set = (field: keyof LoginForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) reset();
  };

  const submit = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    mutate(
      { email: form.email.trim(), password: form.password },
      { onSuccess: () => router.replace('/') },
    );
  };

  const fieldError = (key?: FieldError) =>
    key && <Text style={styles.error}>{t(`auth.errors.${key}`)}</Text>;

  return (
    <AuthLayout
      icon="lock"
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      action={
        <View style={styles.action}>
          {error && (
            <Text style={[styles.error, styles.requestError]}>
              {t(
                `auth.requestErrors.${requestError(error, 'wrongCredentials')}`,
              )}
            </Text>
          )}
          <GradientButton
            label={t('auth.logIn')}
            onPress={submit}
            disabled={isPending}
          />
        </View>
      }
      footnote={
        <AuthFootnote
          text={t('auth.noAccount')}
          linkLabel={t('auth.signUp')}
          href="/registration"
        />
      }
    >
      <View style={styles.form}>
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
            error={!!shown.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
          {fieldError(shown.email)}
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
            error={!!shown.password}
            autoComplete="current-password"
            textContentType="password"
            onSubmitEditing={submit}
          />
          {fieldError(shown.password)}
        </View>
      </View>
    </AuthLayout>
  );
}
