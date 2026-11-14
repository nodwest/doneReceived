import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VERIFICATION_CODE_LENGTH } from '@entities/session';
import { FieldHint, useCooldown } from '@features/auth';
import {
  confirmEmailChangeError,
  useConfirmEmailChange,
  useEmailChangeWatch,
  useResendEmailChange,
  type ChangeEmailErrorInfo,
} from '@features/change-email';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { CodeInput, Icon } from '@shared/ui';
import { styles } from './change-email.styled';

// Сервер шлёт письмо не чаще раза в 60 секунд.
const RESEND_COOLDOWN = 60;

const formatSeconds = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

type Props = {
  /** Новая почта, которая ждёт подтверждения. */
  email: string;
  /** Ввести другой адрес: назад к первой ступени. */
  onUseAnother: () => void;
};

/**
 * Вторая ступень смены почты: код из письма на новый адрес уходит сам после
 * шестого символа, «Отправить ещё раз» с отсчётом. Подтвердили ссылкой (в
 * браузере, хоть на другом устройстве) — профиль перечитывается сам, кнопки
 * для этого нет. Чем кончилось (почта сменилась или смена пропала), решает
 * страница по `pendingEmail` профиля; адрес успели занять — назад к вводу
 * почты.
 */
export function ConfirmStep({ email, onUseAnother }: Props) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState<ChangeEmailErrorInfo | null>(null);
  const confirm = useConfirmEmailChange();
  const resend = useResendEmailChange();
  const watch = useEmailChangeWatch();
  const cooldown = useCooldown(RESEND_COOLDOWN);

  const fail = (info: ChangeEmailErrorInfo) => {
    if (info.field === 'code') {
      setError(info);
      return;
    }
    // Смены нет: перечитываем профиль, страница скажет об этом сама.
    if (info.error === 'noPending') {
      watch.refetch();
      return;
    }
    showToast(
      t(`changeEmail.errors.${info.error}`, { count: info.count ?? 0 }),
    );
    if (info.error === 'emailTaken') onUseAnother();
  };

  const changeCode = (value: string) => {
    setCode(value);
    setError(null);
    if (value.length < VERIFICATION_CODE_LENGTH || confirm.isPending) return;
    // Успех: профиль с новой почтой уходит в кэш, страница закрывается сама.
    confirm.mutate(value, {
      onError: (err) => fail(confirmEmailChangeError(err)),
    });
  };

  const sendAgain = () => {
    resend.mutate(undefined, {
      onSuccess: () => {
        cooldown.restart();
        setCode('');
        setError(null);
        showToast(t('auth.codeResent'));
      },
      onError: (err) => {
        const info = confirmEmailChangeError(err);
        // Письмо было недавно: просто ждём отсчёт заново.
        if (info.error === 'tooManyAttempts') cooldown.restart();
        fail(info);
      },
    });
  };

  // Неверный код — всегда со счётчиком попыток; 0 — нужен новый код.
  const message = !error
    ? null
    : error.error === 'wrongCode' && error.count !== null
      ? error.count > 0
        ? t('changeEmail.errors.wrongCodeLeft', { count: error.count })
        : t('changeEmail.errors.noAttemptsLeft')
      : t(`changeEmail.errors.${error.error}`, { count: error.count ?? 0 });
  const canResend = cooldown.left === 0 && !resend.isPending;

  return (
    <>
      <View style={styles.hero}>
        <LinearGradient
          style={styles.heroIcon}
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="message" size={44} color={theme.colors.white} />
        </LinearGradient>
        <Text style={styles.heroTitle} accessibilityRole="header">
          {t('changeEmail.heroTitle')}
        </Text>
        <Text style={styles.heroSubtitle}>
          {t('auth.verifySubtitleStart')}{' '}
          <Text style={styles.email}>{email}</Text>
          {t('auth.verifySubtitleEnd')}
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t('auth.codeLabel')}</Text>
        <CodeInput
          value={code}
          onChangeText={changeCode}
          length={VERIFICATION_CODE_LENGTH}
          error={!!error}
          editable={!confirm.isPending}
          autoFocus
          accessibilityLabel={t('auth.codeLabel')}
        />
        {message && <FieldHint tone="error" text={message} />}
        <View style={styles.resendRow}>
          <Text style={styles.hint}>{t('auth.noCode')}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canResend }}
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
        <Text style={styles.hint}>{t('changeEmail.linkHint')}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footnote}>
          <Text style={styles.footnoteText}>
            {t('changeEmail.wrongAddress')}
          </Text>
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={onUseAnother}
            disabled={confirm.isPending}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.footnoteLink}>
              {t('changeEmail.changeEmailLink')}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
