import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { theme, tracking } from '../theme';

// Белая полоса между фото, чтобы соседние не сливались при листании.
const GAP = 8;

type PhotoCarouselProps = {
  photos: readonly ImageSourcePropType[];
  height?: number;
};

/**
 * Фото, которые листаются по одному: счётчик «1 / 3» в углу и точки снизу.
 * С одним фото — просто картинка.
 */
export function PhotoCarousel({ photos, height = 300 }: PhotoCarouselProps) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const several = photos.length > 1;
  // Страница — фото и полоса справа: лента шире блока на полосу, лишнее обрезается.
  const page = width + GAP;

  return (
    <View
      style={[styles.root, { height }]}
      onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
    >
      {width > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          scrollEnabled={several}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={{ width: page }}
          onScroll={({ nativeEvent }) =>
            setIndex(Math.round(nativeEvent.contentOffset.x / page))
          }
        >
          {photos.map((photo, i) => (
            <View
              // Фото одного желания не переставляются: индекс годится в ключ.
              key={i}
              style={[styles.page, { width: page }]}
            >
              <Image
                source={photo}
                style={[styles.photo, { width, height }]}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      )}
      {several && (
        <>
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {index + 1} / {photos.length}
            </Text>
          </View>
          <View style={styles.dots}>
            {photos.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: theme.colors.line,
  },
  page: {
    paddingRight: GAP,
    backgroundColor: theme.colors.white,
  },
  photo: {
    backgroundColor: theme.colors.line,
  },
  counter: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(11, 16, 48, 0.45)',
  },
  counterText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dotActive: {
    width: 20,
    backgroundColor: theme.colors.white,
  },
});
