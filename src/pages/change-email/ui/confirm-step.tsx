import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { VERIFICATION_CODE_LENGTH } from '@entities/session';
import { useCooldown } from '@features/auth';
import {
  confirmEmailChangeError,
  useCheckEmailChange,
  useConfirmEmailChange,
  useResendEmailChange,
  type ChangeEmailErrorInfo,
} from '@features/change-email';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { CodeInput, GradientButton } from '@shared/ui';
import { styles } from './change-email.styled';

// Сервер шлёт письмо не чаще раза в 60 секунд.
const RESEND_COOLDOWN = 60;

const formatSeconds = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

type Props = {
  /** Новая почта, которая ждёт подтверждения. */
  email: string;
  /** Почта сменилась. */
  onDone: () => void;
  /** Ввести другой адрес: назад к первой ступени. */
  onUseAnother: () => void;
};

/**
 * Вторая ступень смены почты: код из письма на новый адрес уходит сам после
 * шестого символа, «Отправить ещё раз» с отсчётом. Кнопка «I confirmed via
 * the link» перечитывает профиль: подтверждали ссылкой в браузере. Смены
 * больше нет (истекла) — страница сама вернётся к первой ступени, адрес
 * успели занять — тоже.
 */
export function ConfirmStep({ email, onDone, onUseAnother }: Props) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState<ChangeEmailErrorInfo | null>(null);
  const [notConfirmed, setNotConfirmed] = useState(false);
  const confirm = useConfirmEmailChange();
  const resend = useResendEmailChange();
  const check = useCheckEmailChange();
  const cooldown = useCooldown(RESEND_COOLDOWN);
  const busy = confirm.isPending || check.isPending;

  const fail = (info: ChangeEmailErrorInfo) => {
    if (info.field === 'code') {
      setError(info);
      return;
    }
    showToast(
      t(`changeEmail.errors.${info.error}`, { count: info.count ?? 0 }),
    );
    // Смены нет или адрес заняли — перечитываем профиль: без
    // `pendingEmail` страница вернётся к вводу почты.
    if (info.error === 'noPending') check.mutate();
    if (info.error === 'emailTaken') onUseAnother();
  };

  const success = () => {
    showToast(t('changeEmail.updated'));
    onDone();
  };

  const changeCode = (value: string) => {
    setCode(value);
    setError(null);
    setNotConfirmed(false);
    if (value.length < VERIFICATION_CODE_LENGTH || busy) return;
    confirm.mutate(value, {
      onSuccess: success,
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

  const confirmedViaLink = () => {
    if (busy) return;
    setNotConfirmed(false);
    check.mutate(undefined, {
      onSuccess: (user) => {
        if (user.pendingEmail) setNotConfirmed(true);
        else if (user.email?.toLowerCase() === email.toLowerCase()) success();
        // Смены уже нет, а почта прежняя: страница вернётся к вводу почты.
        else showToast(t('changeEmail.errors.noPending'));
      },
      onError: () => showToast(t('changeEmail.errors.network')),
    });
  };

  const message = error
    ? error.error === 'wrongCode' && error.count !== null
      ? t('changeEmail.errors.wrongCodeLeft', { count: error.count })
      : t(`changeEmail.errors.${error.error}`, { count: error.count ?? 0 })
    : notConfirmed
      ? t('changeEmail.notConfirmed')
      : null;
  const canResend = cooldown.left === 0 && !resend.isPending;

  return (
    <>
      <Text style={styles.intro}>
        {t('auth.verifySubtitleStart')}{' '}
        <Text style={styles.email}>{email}</Text>
        {t('auth.verifySubtitleEnd')} {t('changeEmail.confirmNote')}
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>{t('auth.codeLabel')}</Text>
        <CodeInput
          value={code}
          onChangeText={changeCode}
          length={VERIFICATION_CODE_LENGTH}
          error={!!error}
          editable={!busy}
          autoFocus
          accessibilityLabel={t('auth.codeLabel')}
        />
        {message && <Text style={styles.error}>{message}</Text>}
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
      </View>

      <View style={styles.footer}>
        <GradientButton
          label={t('auth.confirmedViaLink')}
          onPress={confirmedViaLink}
          loading={check.isPending}
          disabled={confirm.isPending}
        />
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={onUseAnother}
          disabled={busy}
          style={({ pressed }) => [styles.another, pressed && styles.pressed]}
        >
          <Text style={styles.resendLink}>{t('changeEmail.useAnother')}</Text>
        </Pressable>
      </View>
    </>
  );
}
