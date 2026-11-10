import { Pressable, Text, View } from 'react-native';
import { CONNECT_CODE_TTL_MS, useConnectCode } from '@entities/device';
import { useTranslation } from '@shared/i18n';
import { copyText, showToast, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './connect-device-panel.styled';

type ConnectDevicePanelProps = {
  /** Семья на сервере; null — моковый ребёнок (Emma, Liam). */
  familyId: string | null;
  childId: string;
  childName: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * «14:59» — сколько ещё действует код. Секунды отбрасываем, а не округляем
 * вверх: только что выданный код показывает 15:00 или 14:59, а не 15:01
 * (часы `useNow` тикают раз в секунду и могут отставать от выдачи кода).
 */
const formatLeft = (ms: number) => {
  const seconds = Math.floor(
    Math.min(Math.max(ms, 0), CONNECT_CODE_TTL_MS) / 1000,
  );
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
};

/**
 * Подключение устройства ребёнка: подсказка, что делать на его телефоне,
 * одноразовый код (тап копирует) и сколько он ещё действует. Код живёт
 * 15 минут, пока жив — сервер отдаёт его же; истёк — вместо таймера
 * «Code expired» и New code, который просит у сервера новый.
 */
export function ConnectDevicePanel({
  familyId,
  childId,
  childName,
}: ConnectDevicePanelProps) {
  const { t } = useTranslation();
  const { data, isFetching, isError, refetch } = useConnectCode(
    familyId,
    childId,
    true,
  );
  const now = useNow(1000);
  // Меню открыли, а в кэше истёкший код — его уже меняют на новый: старый
  // не показываем, иначе мелькнёт «Code expired».
  const stale =
    !!data && isFetching && new Date(data.expiresAt).getTime() <= now.getTime();
  const code = stale ? undefined : data;

  const left = code ? new Date(code.expiresAt).getTime() - now.getTime() : 0;
  const expired = !!code && left <= 0;
  // Кода нет: либо ещё просим у сервера, либо сервер не ответил — тогда
  // ошибка и «Try again», а не пустое окно без кнопок.
  const failed = !code && isError && !isFetching;
  const loading = !code && !failed;

  const copy = async () => {
    if (!code) return;
    await copyText(code.code);
    showToast(t('copyableCode.copied'));
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.instruction}>
        {t('connectDevice.instruction', { name: childName })}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          code ? t('copyableCode.copy', { code: code.code }) : undefined
        }
        disabled={!code || expired}
        onPress={copy}
        style={({ pressed }) => [
          styles.codeBox,
          expired && styles.codeBoxExpired,
          pressed && styles.pressed,
        ]}
      >
        <Text
          style={[styles.code, expired && styles.codeExpired]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {code?.code ?? ' '}
        </Text>
        <View style={styles.copy}>
          <Icon name="copy" size={18} color={theme.colors.grey} />
        </View>
      </Pressable>
      <View style={styles.row}>
        <View style={styles.timer}>
          {failed ? (
            <Text style={styles.expired}>{t('connectDevice.failed')}</Text>
          ) : loading ? (
            <Text style={styles.validFor}>{t('connectDevice.loading')}</Text>
          ) : expired ? (
            <Text style={styles.expired}>{t('connectDevice.expired')}</Text>
          ) : (
            <>
              <Text style={styles.validFor}>{t('connectDevice.validFor')}</Text>
              <Text style={styles.left}>{code ? formatLeft(left) : ''}</Text>
            </>
          )}
        </View>
        {/* Пока код жив, сервер всё равно отдаст его же: новый — после срока. */}
        {(expired || failed) && (
          <Pressable
            accessibilityRole="button"
            disabled={isFetching}
            onPress={() => refetch()}
            style={({ pressed }) => [styles.newCode, pressed && styles.pressed]}
          >
            <Icon name="refresh" size={16} color={theme.colors.violet} />
            <Text style={styles.newCodeLabel}>
              {failed ? t('connectDevice.retry') : t('connectDevice.newCode')}
            </Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.footnote}>
        {t('connectDevice.footnote', { name: childName })}
      </Text>
    </View>
  );
}
