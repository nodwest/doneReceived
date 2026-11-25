import type { ReactElement } from 'react';
import { Pressable, Text, View, type ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from '@shared/i18n';
import { HeaderAvatar } from '@shared/ui';
import { styles } from './home-header.styled';

type HomeHeaderProps = {
  summary?: ReactElement;
  greeting: string;
  name: string;
  /** Фото; null — первая буква имени. */
  avatar: ImageSourcePropType | null;
};

/**
 * Шапка главной: приветствие с именем и аватар справа. Тап по аватару —
 * вкладка Profile (как из навбара).
 */
export function HomeHeader({
  greeting,
  name,
  avatar,
  summary,
}: HomeHeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, summary && styles.withSummary]}>
      <View style={[styles.greeting, summary && styles.compactGreeting]}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <Text style={styles.name} numberOfLines={summary ? 1 : undefined}>
          {name}
        </Text>
      </View>
      {summary && <View style={styles.summary}>{summary}</View>}
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
