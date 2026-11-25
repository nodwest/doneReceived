import { Pressable, Text } from 'react-native';
import { createStyles, theme, tracking } from '@shared/theme';
import { LetterAvatar } from '@shared/ui';
import type { FamilyEventPerson } from '../model/family-event';

type EventPersonChipProps = {
  person: FamilyEventPerson;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** Участник события в форме: аватар и имя, выбранный — синий. */
export function EventPersonChip({
  person,
  selected,
  disabled,
  onPress,
}: EventPersonChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
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

const styles = createStyles((colors) => ({
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
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  selected: {
    borderColor: colors.childFrom,
    backgroundColor: colors.childTint,
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
    color: colors.inkSoft,
  },
  nameSelected: {
    color: colors.childInk,
    fontFamily: theme.fonts.bold,
  },
}));
