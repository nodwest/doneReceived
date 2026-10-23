import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@shared/ui';
import { useTimeAgo } from '@shared/lib';
import { theme } from '@shared/theme';
import type { Presence } from '../model/presence';
import { styles } from './presence-badge.styled';

/** «At home · 5 min ago» с домиком или серая «Away · 12 min ago». */
export function PresenceBadge({ atHome, since }: Presence) {
  const ago = useTimeAgo(since);

  if (!atHome) {
    return (
      <View style={[styles.badge, styles.away]}>
        <Text style={[styles.text, styles.awayText]}>Away · {ago}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.homeFrom, theme.colors.homeTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.badge}
    >
      <Icon name="home" size={16} color={theme.colors.homeBrown} />
      <Text style={[styles.text, styles.homeText]}>At home · {ago}</Text>
    </LinearGradient>
  );
}
