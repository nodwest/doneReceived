import { Pressable, StyleSheet, Text } from 'react-native';
import { theme, tracking } from '@shared/theme';
import { LetterAvatar } from '@shared/ui';
import type { FamilyEventPerson } from '../model/family-event';

type EventPersonChipProps = {
  person: FamilyEventPerson;
  selected: boolean;
  onPress: () => void;
};

/** Участник события в форме: аватар и имя, выбранный — синий. */
export function EventPersonChip({
  person,
  selected,
  onPress,
}: EventPersonChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={person.name}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <LetterAvatar
        source={person.avatar}
        name={person.name}
        tone="blue"
        letterSize={10}
        style={styles.avatar}
      />
      <Text
        style={[styles.name, selected && styles.nameSelected]}
        numberOfLines={1}
      >
        {person.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    maxWidth: 150,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
    paddingRight: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  selected: {
    borderColor: theme.colors.childFrom,
    backgroundColor: theme.colors.childTint,
  },
  pressed: {
    opacity: 0.8,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  name: {
    flexShrink: 1,
    fontSize: 10,
    letterSpacing: tracking(10),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.inkSoft,
  },
  nameSelected: {
    color: theme.colors.childDeep,
    fontFamily: theme.fonts.bold,
  },
});
