import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { useTimeAgo } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { Device } from '../model/device';
import { styles } from './device-row.styled';

type DeviceRowProps = {
  device: Device;
  tracked: boolean;
  onSelect: () => void;
  disabled?: boolean;
  /** Корзина справа; без обработчика её нет. */
  onRemove?: () => void;
};

/**
 * Устройство ребёнка в списке: значок телефона (фиолетовый, если на связи),
 * модель и «Online now», «Last seen …» или «Connected …», справа — корзина.
 */
export function DeviceRow({
  device,
  tracked,
  onSelect,
  onRemove,
  disabled,
}: DeviceRowProps) {
  const { t } = useTranslation();
  // Последний выход на связь; у устройства, которое ещё не выходило, — время
  // подключения.
  const lastSeen = useTimeAgo(device.lastSeenAt ?? device.connectedAt ?? '');
  const online = !!device.online;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('devices.track', { name: device.name })}
        accessibilityState={{ selected: tracked, disabled }}
        onPress={onSelect}
        disabled={disabled}
        style={({ pressed }) => [styles.selection, pressed && styles.pressed]}
      >
        <View style={[styles.icon, online && styles.iconOnline]}>
          <Icon
            name="phone"
            size={18}
            color={online ? theme.colors.violet : theme.colors.grey}
          />
        </View>
        <View style={styles.texts}>
          <Text style={styles.name} numberOfLines={1}>
            {device.name}
          </Text>
          <Text style={styles.status} numberOfLines={1}>
            {online
              ? t('devices.onlineNow')
              : device.lastSeenAt
                ? t('devices.lastSeen', { time: lastSeen })
                : t('devices.connected', { time: lastSeen })}
          </Text>
        </View>
      </Pressable>
      {tracked && (
        <View
          accessible
          accessibilityLabel={t('devices.tracked')}
          style={styles.tracked}
        >
          <Icon name="map" size={19} color={theme.colors.blueInk} />
        </View>
      )}
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('devices.remove', { name: device.name })}
          hitSlop={6}
          onPress={onRemove}
          disabled={disabled}
          style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
        >
          <Icon name="trash" size={18} color={theme.colors.dangerText} />
        </Pressable>
      )}
    </View>
  );
}
