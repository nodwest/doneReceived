import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import { styles } from './home-summary.styled';

type StatCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
  accent?: boolean;
  /** Тёплая подсветка: есть задания, ожидающие проверки. */
  highlight?: boolean;
  onPress?: () => void;
};

export function StatCard({
  icon,
  value,
  label,
  accent,
  highlight,
  onPress,
}: StatCardProps) {
  const content = (
    <>
      <View style={styles.valueRow}>
        <Text style={[styles.value, accent && styles.textAccent]}>{value}</Text>
        {icon}
      </View>
      <Text style={[styles.label, accent && styles.textAccent]}>{label}</Text>
    </>
  );

  let card = <View style={styles.card}>{content}</View>;
  if (accent) {
    card = (
      <LinearGradient
        colors={[theme.colors.violet, theme.colors.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.7071]}
        style={styles.cardAccent}
      >
        {content}
      </LinearGradient>
    );
  } else if (highlight) {
    card = (
      <LinearGradient
        colors={[theme.colors.reviewFrom, theme.colors.reviewTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.7071]}
        style={styles.cardReview}
      >
        {content}
      </LinearGradient>
    );
  }

  if (!onPress) return card;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      {card}
    </Pressable>
  );
}
