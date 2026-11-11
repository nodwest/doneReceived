import { Text, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { FamilyRole } from '@entities/user';
import { theme } from '@shared/theme';
import { LetterAvatar } from '@shared/ui';
import { styles } from './profile-hero.styled';

type ProfileHeroProps = {
  name: string;
  email: string;
  /** Фото; null — первая буква имени. */
  avatar: ImageSourcePropType | null;
  role: FamilyRole;
};

const HERO_COLORS = {
  parent: [theme.colors.parentTo, theme.colors.parentFrom],
  child: [theme.colors.childFrom, theme.colors.childDeep],
} as const;

/**
 * Карточка вошедшего пользователя: имя, аватар и почта. У родителя —
 * тёмно-синяя с обводкой, у ребёнка — голубая.
 */
export function ProfileHero({ name, email, avatar, role }: ProfileHeroProps) {
  return (
    <LinearGradient
      colors={HERO_COLORS[role]}
      // Угол 156° из макета для карточки ~351×155.
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      locations={[0, 0.7071]}
      style={[styles.hero, role === 'parent' && styles.heroParent]}
    >
      <Text style={styles.name}>{name}</Text>
      <LetterAvatar
        source={avatar}
        name={name}
        style={styles.avatar}
        letterSize={28}
      />
      <Text style={styles.email}>{email}</Text>
    </LinearGradient>
  );
}
