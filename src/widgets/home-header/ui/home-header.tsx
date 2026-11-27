import type { ReactElement } from 'react';
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from '@shared/i18n';
import { HeaderAvatar } from '@shared/ui';
import { styles } from './home-header.styled';

type HomeHeaderProps = {
  summary?: ReactElement;
  name: string;
  /** Фото; null — первая буква имени. */
  avatar: ImageSourcePropType | null;
};

/**
 * Шапка главной: имя и аватар справа. Тап по аватару —
 * вкладка Profile (как из навбара).
 */
export function HomeHeader({ name, avatar, summary }: HomeHeaderProps) {
  const { t } = useTranslation();
  const { width, fontScale } = useWindowDimensions();
  const inline = !!summary && width >= 390 && fontScale <= 1.15;
  return (
    <>
      <View style={[styles.container, inline && styles.withSummary]}>
        <View style={inline && styles.compactName}>
          <Text style={styles.name} numberOfLines={inline ? 1 : undefined}>
            {name}
          </Text>
        </View>
        {inline && <View style={styles.summary}>{summary}</View>}
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
      {!inline && summary}
    </>
  );
}
