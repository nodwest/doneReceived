import { Pressable, Text, View, type ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from '@shared/i18n';
import { HeaderAvatar } from '@shared/ui';
import { styles } from './home-header.styled';

type HomeHeaderProps = {
  greeting: string;
  name: string;
  /** Фото; null — первая буква имени. */
  avatar: ImageSourcePropType | null;
};

/**
 * Шапка главной: приветствие с именем и аватар справа. Тап по аватару —
 * вкладка Profile (как из навбара).
 */
export function HomeHeader({ greeting, name, avatar }: HomeHeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <Text style={styles.name}>{name}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.profile')}
        hitSlop={8}
        onPress={() => router.dismissTo('/profile')}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <HeaderAvatar source={avatar} name={name} />
      </Pressable>
    </View>
  );
}
