import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { VERIFICATION_CODE_LENGTH } from '@entities/session';
import {
  requestError,
  signUpCredentials,
  useCooldown,
  useLogin,
  useResendVerification,
  useVerifyEmail,
} from '@features/auth';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { AuthLayout, CodeInput, GradientButton } from '@shared/ui';
import { styles } from './verify-email.styled';

// Сколько ждать перед повторной отправкой письма.
const RESEND_COOLDOWN = 60;

const formatSeconds = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/**
 * Подтверждение почты после регистрации (`/verify-email?email=…`): код из
 * письма уходит сам, как только введены все символы; повторная отправка с
 * отсчётом. Кнопка внизу — для тех, кто подтвердил почту ссылкой из письма.
 * После подтверждения входим почтой и паролем из регистрации и открываем
 * главную. Если их нет (приложение перезапускали) или вход не удался —
 * логин с подставленной почтой.
 */
export function VerifyEmail() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const verify = useVerifyEmail();
  const resend = useResendVerification();
  const cooldown = useCooldown(RESEND_COOLDOWN);
  const login = useLogin();

  // Без почты подтверждать нечего: открыли экран не из регистрации.
  if (!email) return <Redirect href="/registration" />;

  const toLogin = () =>
    router.replace({ pathname: '/login', params: { email } });

  /**
   * Почта подтверждена — входим. `viaLink`: подтверждали ссылкой; если вход
   * не удался (401 — по ссылке ещё не перешли), остаёмся здесь с ошибкой.
   */
  const enter = (viaLink: boolean) => {
    const credentials = signUpCredentials(email);
    if (!credentials) {
      toLogin();
      return;
    }
    login.mutate(credentials, {
      onSuccess: () => {
        if (viaLink) showToast(t('auth.emailConfirmed'));
        router.replace('/');
      },
      onError: () => {
        if (!viaLink) toLogin();
      },
    });
  };

  const submit = (value: string) => {
    if (verify.isPending || login.isPending) return;
    verify.mutate(
      { email, code: value },
      {
        onSuccess: () => {
          showToast(t('auth.emailConfirmed'));
          enter(false);
        },
      },
    );
  };

  const confirmedViaLink = () => {
    if (login.isPending) return;
    enter(true);
  };

  const changeCode = (value: string) => {
    setCode(value);
    if (verify.error) verify.reset();
    if (login.error) login.reset();
    if (value.length === VERIFICATION_CODE_LENGTH) submit(value);
  };

  const sendAgain = () => {
    resend.mutate(email, {
      onSuccess: () => {
        cooldown.restart();
        setCode('');
        verify.reset();
        showToast(t('auth.codeResent'));
      },
    });
  };

  const error = verify.error
    ? requestError(verify.error, 'wrongCode')
    : login.error
      ? requestError(login.error, 'notConfirmed')
      : resend.error
        ? requestError(resend.error, 'resendFailed')
        : null;
  const canResend = cooldown.left === 0 && !resend.isPending;

  return (
    <AuthLayout
      icon="message"
      title={t('auth.verifyTitle')}
      subtitle={
        <>
          {t('auth.verifySubtitleStart')}{' '}
          <Text style={styles.email}>{email}</Text>
          {t('auth.verifySubtitleEnd')}
        </>
      }
      action={
        <GradientButton
          label={t('auth.confirmedViaLink')}
          onPress={confirmedViaLink}
          disabled={login.isPending}
        />
      }
    >
      <View style={styles.field}>
        <Text style={styles.label}>{t('auth.codeLabel')}</Text>
        <CodeInput
          value={code}
          onChangeText={changeCode}
          length={VERIFICATION_CODE_LENGTH}
          error={!!verify.error}
          editable={!verify.isPending && !login.isPending}
          autoFocus
          accessibilityLabel={t('auth.codeLabel')}
        />
        {error && (
          <Text style={styles.error}>{t(`auth.requestErrors.${error}`)}</Text>
        )}
        <View style={styles.resendRow}>
          <Text style={styles.hint}>{t('auth.noCode')}</Text>
          <Pressable
            accessibilityRole="button"
            disabled={!canResend}
            onPress={sendAgain}
            hitSlop={8}
            style={({ pressed }) => [styles.resend, pressed && styles.pressed]}
          >
            {cooldown.left > 0 ? (
              <Text style={styles.resendWaiting}>
                {t('auth.resendIn')}{' '}
                <Text style={styles.timer}>{formatSeconds(cooldown.left)}</Text>
              </Text>
            ) : (
              <Text
                style={[styles.resendLink, !canResend && styles.resendWaiting]}
              >
                {t('auth.resend')}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </AuthLayout>
  );
}
