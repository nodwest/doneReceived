import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import type { GeoPoint, Presence } from '@entities/user';
import { useTimeAgo } from '@shared/lib';
import { MiniMap } from './mini-map';
import { styles } from './map-preview.styled';

type MapPreviewProps = {
  position: GeoPoint;
  avatar: ImageSourcePropType;
  presence: Presence;
  onPress: () => void;
};

/**
 * Превью карты в профиле члена семьи: точка с аватаром по центру и подпись
 * «Home · 5 min ago». Тап открывает вкладку Map.
 */
export function MapPreview({
  position,
  avatar,
  presence,
  onPress,
}: MapPreviewProps) {
  const ago = useTimeAgo(presence.since);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Open map"
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.map}>
        <MiniMap center={position} />
      </View>
      <View style={styles.pin}>
        <Image source={avatar} style={styles.pinPhoto} />
      </View>
      <View style={styles.place}>
        <Text style={styles.placeName}>
          {presence.atHome ? 'Home' : 'Away'}
        </Text>
        <Text style={styles.placeTime}>· {ago}</Text>
      </View>
    </Pressable>
  );
}
