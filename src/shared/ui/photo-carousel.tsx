import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../i18n';
import { ApiImage } from './api-image';
import { PhotoViewer } from './photo-viewer';
import {
  Platform,
  Pressable,
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
  /** Скругление углов: 24 у желания, 20 в карточке задания. */
  radius?: number;
};

/**
 * Фото, которые листаются по одному: счётчик «1 / 3» в углу и точки снизу.
 * С одним фото — просто картинка. Тап открывает `PhotoViewer` на этом фото;
 * закрыли просмотр на другом — карусель встаёт на него.
 */
export function PhotoCarousel({
  photos,
  height = 300,
  radius = 24,
}: PhotoCarouselProps) {
  const { t } = useTranslation();
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [viewing, setViewing] = useState<number | null>(null);
  const scroll = useRef<ScrollView>(null);
  const several = photos.length > 1;
  // Страница — фото и полоса справа: лента шире блока на полосу, лишнее обрезается.
  const page = width + GAP;

  // Лента под просмотром идёт за ним: листается без анимации, пока её не видно.
  const showPhoto = (target: number) => {
    setIndex(target);
    scroll.current?.scrollTo({ x: target * page, animated: false });
  };

  const openViewer = (target: number) => {
    // В вебе модалка, закрываясь, возвращает фокус туда, где он был, и
    // браузер прокручивает ленту к фото, по которому открыли. Снимаем фокус
    // заранее — лента остаётся на фото, где закрыли.
    if (Platform.OS === 'web') {
      (document.activeElement as HTMLElement | null)?.blur();
    }
    setViewing(target);
  };

  // На каком фото закрыли просмотр — на нём лента должна стоять после закрытия.
  const closedAt = useRef<number | null>(null);

  const closeViewer = (last: number) => {
    closedAt.current = last;
    setIndex(last);
    setViewing(null);
  };

  // Страховка после закрытия: если что-то сдвинуло ленту, пока закрывалась
  // модалка, ставим её обратно. Обычно она уже на месте и ничего не движется.
  useEffect(() => {
    if (viewing !== null || closedAt.current === null) return;
    const target = closedAt.current;
    closedAt.current = null;
    scroll.current?.scrollTo({ x: target * page, animated: false });
  }, [viewing, page]);

  return (
    <View
      style={[styles.root, { height, borderRadius: radius }]}
      onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
    >
      {/* Ширина ещё не замерена: первое фото — сразу во весь блок, чтобы
          в первом кадре не было пусто. */}
      {width === 0 && photos.length > 0 && (
        <ApiImage
          source={photos[0]}
          style={[styles.photo, styles.fill]}
          resizeMode="cover"
        />
      )}
      {width > 0 && (
        <ScrollView
          ref={scroll}
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
              <Pressable
                accessibilityRole="imagebutton"
                accessibilityLabel={t('photos.open', {
                  current: i + 1,
                  count: photos.length,
                })}
                onPress={() => openViewer(i)}
              >
                <ApiImage
                  source={photo}
                  style={[styles.photo, { width, height }]}
                  resizeMode="cover"
                />
              </Pressable>
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
      <PhotoViewer
        photos={photos}
        index={viewing}
        onClose={closeViewer}
        onIndexChange={showPhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
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
  fill: {
    width: '100%',
    height: '100%',
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
