import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { styles } from './task-icon-badge.styled';

type BadgeSize = 52 | 48 | 44 | 40;

// Размер иконки в плашке: плитка главной, список, история наград, Wallet.
const ICON_SIZE: Record<BadgeSize, number> = { 52: 24, 48: 22, 44: 20, 40: 19 };

/** Голубая плашка с иконкой задания на экранах ребёнка. */
export function TaskIconBadge({ size = 52 }: { size?: BadgeSize }) {
  return (
    <LinearGradient
      colors={[theme.colors.childTo, theme.colors.childFrom]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={[
        styles.badge,
        size < 48 && styles.badgeSmall,
        { width: size, height: size },
      ]}
    >
      <Icon name="task" size={ICON_SIZE[size]} color={theme.colors.white} />
    </LinearGradient>
  );
}
