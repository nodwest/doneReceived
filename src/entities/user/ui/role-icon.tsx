import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { ROLE_COLORS } from '../config/role-colors';
import type { FamilyRole } from '../model/role';

// Пропорции из макета для иконки 51pt: глиф 30, скругление 16.
const DEFAULT_SIZE = 51;

type RoleIconProps = {
  role: FamilyRole;
  /** Сторона квадрата: 51 в кодах приглашения, 44 в плашке семьи, 56 в выборе роли. */
  size?: number;
};

/** Квадратная иконка роли с градиентом: родитель или ребёнок. */
export function RoleIcon({ role, size = DEFAULT_SIZE }: RoleIconProps) {
  const ratio = size / DEFAULT_SIZE;
  return (
    <LinearGradient
      colors={ROLE_COLORS[role].icon}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={[
        styles.icon,
        { width: size, height: size, borderRadius: 16 * ratio },
      ]}
    >
      <Icon
        name={role}
        size={Math.round(30 * ratio)}
        color={theme.colors.white}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
