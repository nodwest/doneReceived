import { Pressable, Text, View } from 'react-native';
import { formatClock, formatMonthDay } from '@shared/lib';
import { LetterAvatar } from '@shared/ui';
import type { FamilyEvent } from '../model/family-event';
import { styles } from './calendar-event.styled';

type EventTileProps = {
  event: FamilyEvent;
  onPress: () => void;
};

export function EventTile({ event, onPress }: EventTileProps) {
  const date =
    formatMonthDay(event.startsAt) + ' · ' + formatClock(event.startsAt);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={event.title + '. ' + date}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <Text style={styles.tileTitle} numberOfLines={2}>
        {event.title}
      </Text>
      <Text style={styles.tileMeta}>{date}</Text>
      <View style={styles.tileAvatars}>
        {event.participants.slice(0, 3).map((person, index) => (
          <LetterAvatar
            key={person.id}
            name={person.name}
            source={person.avatar}
            letterSize={11}
            style={[styles.avatar, index > 0 && styles.avatarOverlap]}
          />
        ))}
      </View>
    </Pressable>
  );
}
