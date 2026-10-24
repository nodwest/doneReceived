import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon, type IconName } from '@shared/ui';
import { theme } from '@shared/theme';
import { styles } from './settings-row.styled';

type SettingsRowProps = {
  icon: IconName;
  label: string;
  /** Текущее значение серым перед стрелкой (Language → English). */
  value?: string;
  /** Элемент справа вместо стрелки (тогл). */
  right?: ReactNode;
  onPress?: () => void;
};

/** Пункт меню профиля: иконка в фиолетовой плашке, название и стрелка. */
export function SettingsRow({
  icon,
  label,
  value,
  right,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.pressed,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.icon}>
        <Icon name={icon} size={20} color={theme.colors.violet} />
      </View>
      <Text style={styles.label}>{label}</Text>
      {right ?? (
        <>
          {value && <Text style={styles.value}>{value}</Text>}
          <Icon name="chevron-right" size={16} color={theme.colors.grey} />
        </>
      )}
    </Pressable>
  );
}
