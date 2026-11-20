import type { ReactNode, Ref } from 'react';
import { Pressable, Text, View } from 'react-native';
import { createStyles, theme, tracking } from '../theme';
import { Icon, type IconName } from './icons';

type SettingsRowProps = {
  icon: IconName;
  label: string;
  /** Текущее значение серым перед стрелкой (Language → English). */
  value?: string;
  /** Элемент справа вместо стрелки (тогл). */
  right?: ReactNode;
  onPress?: () => void;
  /** Для меню, которое раскрывается у пункта (измерить его положение). */
  ref?: Ref<View>;
};

/**
 * Пункт меню настроек: иконка в фиолетовой плашке, название и стрелка —
 * меню на вкладке Profile и блок Security в Edit profile.
 */
export function SettingsRow({
  icon,
  label,
  value,
  right,
  onPress,
  ref,
}: SettingsRowProps) {
  return (
    <Pressable
      ref={ref}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.pressed,
      ]}
      onPress={onPress}
      disabled={!onPress && !right}
    >
      <View style={styles.icon}>
        <Icon name={icon} size={20} color={theme.colors.violetInk} />
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

const styles = createStyles((colors) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violetIcon,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontFamily: theme.fonts.semibold,
    letterSpacing: tracking(15),
    color: colors.ink,
  },
  value: {
    fontSize: theme.fontSize.inputName,
    fontFamily: theme.fonts.medium,
    letterSpacing: tracking(theme.fontSize.inputName),
    color: colors.grey,
  },
}));
