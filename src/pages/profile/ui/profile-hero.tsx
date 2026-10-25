import { Image, Text, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import { styles } from './profile-hero.styled';

type ProfileHeroProps = {
  name: string;
  email: string;
  avatar: ImageSourcePropType;
};

/** Тёмно-синяя карточка вошедшего родителя: имя, аватар и почта. */
export function ProfileHero({ name, email, avatar }: ProfileHeroProps) {
  return (
    <LinearGradient
      colors={[theme.colors.parentTo, theme.colors.parentFrom]}
      // Угол 156° из макета для карточки ~351×155.
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      locations={[0, 0.7071]}
      style={styles.hero}
    >
      <Text style={styles.name}>{name}</Text>
      <Image source={avatar} style={styles.avatar} />
      <Text style={styles.email}>{email}</Text>
    </LinearGradient>
  );
}
