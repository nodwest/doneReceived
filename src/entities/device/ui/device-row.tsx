import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { useTimeAgo } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { Device } from '../model/device';
import { styles } from './device-row.styled';

type DeviceRowProps = {
  device: Device;
  /** Корзина справа; без обработчика её нет. */
  onRemove?: () => void;
};

/**
 * Устройство ребёнка в списке: значок телефона (фиолетовый, если на связи),
 * модель и «Online now» или «Last seen …», справа — корзина.
 */
export function DeviceRow({ device, onRemove }: DeviceRowProps) {
  const { t } = useTranslation();
  const lastSeen = useTimeAgo(device.lastSeenAt);
  const { online } = device;

  return (
    <View style={styles.row}>
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
            : t('devices.lastSeen', { time: lastSeen })}
        </Text>
      </View>
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('devices.remove', { name: device.name })}
          hitSlop={6}
          onPress={onRemove}
          style={({ pressed }) => [styles.remove, pressed && styles.pressed]}
        >
          <Icon name="trash" size={18} color={theme.colors.dangerText} />
        </Pressable>
      )}
    </View>
  );
}
