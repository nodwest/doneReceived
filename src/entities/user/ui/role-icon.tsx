import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { ROLE_COLORS } from '../config/role-colors';
import type { FamilyRole } from '../model/role';

/** Квадратная иконка роли с градиентом: родитель или ребёнок. */
export function RoleIcon({ role }: { role: FamilyRole }) {
  return (
    <LinearGradient
      colors={ROLE_COLORS[role].icon}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={styles.icon}
    >
      <Icon name={role} size={30} color={theme.colors.white} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 51,
    height: 51,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
