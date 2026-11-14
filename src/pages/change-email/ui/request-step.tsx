import { useState } from 'react';
import { Text, View } from 'react-native';
import { FieldHint, validateEmail } from '@features/auth';
import {
  requestEmailChangeError,
  useRequestEmailChange,
  type ChangeEmailErrorInfo,
} from '@features/change-email';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { GradientButton, InputWithIcon, Label } from '@shared/ui';
import { styles } from './change-email.styled';

type Props = {
  /** Почта аккаунта сейчас: по ней вход, пока новую не подтвердили. */
  currentEmail: string;
  /** Письмо ушло: страница переходит к вводу кода. */
  onSent: () => void;
};

/**
 * Первая ступень смены почты: новый адрес и пароль от приложения → Send
 * code. Неверный адрес, пароль, своя же или занятая почта — ошибка под
 * полем, остальное (сеть, 429) — тостом.
 */
export function RequestStep({ currentEmail, onSent }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [serverError, setServerError] = useState<ChangeEmailErrorInfo | null>(
    null,
  );
  const { mutate, isPending } = useRequestEmailChange();

  const formatError = validateEmail(email);
  const same =
    !formatError &&
    email.trim().toLowerCase() === currentEmail.trim().toLowerCase();
  const canSubmit = !formatError && !same && !!password && !isPending;

  const change = (set: (value: string) => void) => (value: string) => {
    set(value);
    // Ошибка сервера была про прежние значения.
    if (serverError) setServerError(null);
  };

  const submit = () => {
    if (!canSubmit) return;
    mutate(
      { newEmail: email.trim(), currentPassword: password },
      {
        onSuccess: () => {
          showToast(t('changeEmail.sent'));
          onSent();
        },
        onError: (error) => {
          const info = requestEmailChangeError(error);
          if (info.field) setServerError(info);
          else {
            showToast(
              t(`changeEmail.errors.${info.error}`, { count: info.count ?? 0 }),
            );
          }
        },
      },
    );
  };

  const emailServerError =
    serverError?.field === 'newEmail' ? serverError.error : null;
  const emailHint = same
    ? t('changeEmail.errors.sameAsCurrent')
    : emailServerError
      ? t(`changeEmail.errors.${emailServerError}`)
      : emailTouched && email && formatError
        ? t(`auth.errors.${formatError}`)
        : null;
  const passwordWrong = serverError?.field === 'password';

  return (
    <>
      <Text style={styles.intro}>
        {t('changeEmail.intro')}{' '}
        <Text style={styles.email}>{currentEmail}</Text>.
      </Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Label htmlFor="new-email" style={styles.label}>
            {t('changeEmail.newEmail')}
          </Label>
          <InputWithIcon
            id="new-email"
            placeholder={t('changeEmail.newEmailPlaceholder')}
            iconName="message"
            value={email}
            onChangeText={change(setEmail)}
            onBlur={() => setEmailTouched(true)}
            error={!!emailHint}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
          {emailHint && <FieldHint tone="error" text={emailHint} />}
        </View>

        <View style={styles.field}>
          <Label htmlFor="email-password" style={styles.label}>
            {t('changeEmail.password')}
          </Label>
          <InputWithIcon
            secureTextEntry
            id="email-password"
            placeholder={t('changeEmail.passwordPlaceholder')}
            iconName="castle"
            value={password}
            onChangeText={change(setPassword)}
            error={passwordWrong}
            autoComplete="current-password"
            textContentType="password"
          />
          {passwordWrong ? (
            <FieldHint
              tone="error"
              text={t('changeEmail.errors.wrongPassword')}
            />
          ) : (
            <FieldHint tone="muted" text={t('changePassword.currentHint')} />
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <GradientButton
          label={t('changeEmail.send')}
          onPress={submit}
          disabled={!canSubmit}
          loading={isPending}
        />
      </View>
    </>
  );
}
