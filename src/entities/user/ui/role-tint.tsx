import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import { ROLE_COLORS } from '../config/role-colors';
import type { FamilyRole } from '../model/role';

type RoleTintProps = {
  role: FamilyRole;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * Белый блок с еле заметным оттенком роли и обводкой того же цвета — фон
 * карточек участников и блоков кодов приглашения.
 */
export function RoleTint({ role, style, children }: RoleTintProps) {
  const { tint, border } = ROLE_COLORS[role];
  return (
    <LinearGradient
      colors={tint}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[styles.base, { borderColor: border }, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
  },
});
