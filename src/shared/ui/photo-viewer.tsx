import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
  type PanResponderCallbacks,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../i18n';
import { theme, tracking } from '../theme';
import { ApiImage } from './api-image';
import { Icon } from './icons';

// Тёмная полоса между фото при листании.
const GAP = 16;
const OPEN_MS = 240;
const CLOSE_MS = 220;
// Смахнули дальше или быстрее — просмотр закрывается, иначе фото возвращается.
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.8;
// Сколько надо утянуть, чтобы кнопки и точки исчезли совсем.
const CHROME_FADE_DISTANCE = 100;

type PhotoViewerProps = {
  photos: readonly ImageSourcePropType[];
  /** С какого фото открыт просмотр; null — закрыт. */
  index: number | null;
  /**
   * Просмотр закрылся (крестиком, «назад» или смахиванием) на фото `index`:
   * карусель, из которой открыли, листается к нему.
   */
  onClose: (index: number) => void;
  /**
   * В просмотре долистали до другого фото: карусель под ним встаёт на него
   * заранее, и после закрытия ничего не перелистывается на глазах.
   */
  onIndexChange?: (index: number) => void;
};

/**
 * Фото на весь экран: целиком, без обрезки (горизонтальные и вертикальные),
 * листаются вбок, счётчик «1 / 3» и точки; смахнуть вверх или вниз — закрыть.
 */
export function PhotoViewer({
  photos,
  index,
  onClose,
  onIndexChange,
}: PhotoViewerProps) {
  if (index === null || photos.length === 0) return null;
  // Каждое открытие — новое содержимое: лента сразу стоит на нужном фото.
  return (
    <ViewerContent
      photos={photos}
      initialIndex={Math.min(Math.max(index, 0), photos.length - 1)}
      onClose={onClose}
      onIndexChange={onIndexChange}
    />
  );
}

type ViewerContentProps = {
  photos: readonly ImageSourcePropType[];
  initialIndex: number;
  onClose: (index: number) => void;
  onIndexChange?: (index: number) => void;
};

function ViewerContent({
  photos,
  initialIndex,
  onClose,
  onIndexChange,
}: ViewerContentProps) {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const page = width + GAP;
  const several = photos.length > 1;

  const [current, setCurrent] = useState(initialIndex);
  const [appear] = useState(() => new Animated.Value(0));
  const [drag] = useState(() => new Animated.Value(0));
  const scroll = useRef<ScrollView>(null);
  const scrolledToStart = useRef(false);
  // Обработчики жеста создаются один раз — свежие значения берут отсюда.
  const latest = useRef({
    current: initialIndex,
    height,
    page,
    onClose,
    onIndexChange,
  });
  const closing = useRef(false);

  useEffect(() => {
    latest.current.height = height;
    latest.current.page = page;
    latest.current.onClose = onClose;
    latest.current.onIndexChange = onIndexChange;
  }, [height, page, onClose, onIndexChange]);

  const [close] = useState(() => (direction: -1 | 0 | 1) => {
    if (closing.current) return;
    closing.current = true;
    const easing = Easing.in(Easing.cubic);
    Animated.parallel([
      Animated.timing(appear, {
        toValue: 0,
        duration: CLOSE_MS,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(drag, {
        toValue: direction * latest.current.height,
        duration: CLOSE_MS,
        easing,
        useNativeDriver: true,
      }),
    ]).start(() => latest.current.onClose(latest.current.current));
  });

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: OPEN_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [appear]);

  const [handlers] = useState<PanResponderCallbacks>(() => ({
    // Вертикальное движение забираем у ленты: вбок она листает сама.
    onMoveShouldSetPanResponderCapture: (_, { dx, dy }) =>
      !closing.current && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx) * 1.5,
    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: (_, { dy }) => drag.setValue(dy),
    onPanResponderRelease: (_, { dy, vy }) => {
      if (Math.abs(dy) > DISMISS_DISTANCE || Math.abs(vy) > DISMISS_VELOCITY) {
        close(dy < 0 ? -1 : 1);
        return;
      }
      Animated.spring(drag, {
        toValue: 0,
        speed: 18,
        bounciness: 4,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminate: () =>
      Animated.spring(drag, { toValue: 0, useNativeDriver: true }).start(),
  }));
  const [responder] = useState(() => PanResponder.create(handlers));

  const goTo = (target: number) => {
    const next = Math.min(Math.max(target, 0), photos.length - 1);
    scroll.current?.scrollTo({ x: next * page, animated: true });
  };

  // В вебе мышью ленту не потянуть: фото листаются ещё и стрелками.
  useEffect(() => {
    if (Platform.OS !== 'web' || !several) return;
    const onKey = (event: KeyboardEvent) => {
      const step =
        event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      const next = Math.min(
        Math.max(latest.current.current + step, 0),
        photos.length - 1,
      );
      scroll.current?.scrollTo({
        x: next * latest.current.page,
        animated: true,
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [several, photos.length]);

  const fade = drag.interpolate({
    inputRange: [-height, 0, height],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });
  const shrink = drag.interpolate({
    inputRange: [-height, 0, height],
    outputRange: [0.7, 1, 0.7],
    extrapolate: 'clamp',
  });
  const grow = appear.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });
  const chrome = Animated.multiply(
    appear,
    drag.interpolate({
      inputRange: [-CHROME_FADE_DISTANCE, 0, CHROME_FADE_DISTANCE],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
  );

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      // «Назад» на Android и Escape в вебе: закрытие с анимацией.
      onRequestClose={() => close(0)}
    >
      <View
        style={styles.root}
        accessibilityViewIsModal
        {...responder.panHandlers}
      >
        <StatusBar style="light" />
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
            { opacity: Animated.multiply(appear, fade) },
          ]}
        />
        <Animated.View
          style={[
            styles.root,
            {
              opacity: appear,
              transform: [
                { translateY: drag },
                { scale: Animated.multiply(grow, shrink) },
              ],
            },
          ]}
        >
          <ScrollView
            ref={scroll}
            horizontal
            pagingEnabled
            scrollEnabled={several}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentOffset={{ x: initialIndex * page, y: 0 }}
            // В вебе contentOffset не работает: к нужному фото листаем сами.
            onContentSizeChange={() => {
              if (scrolledToStart.current) return;
              scrolledToStart.current = true;
              scroll.current?.scrollTo({
                x: initialIndex * page,
                animated: false,
              });
            }}
            onScroll={({ nativeEvent }) => {
              const next = Math.min(
                Math.max(Math.round(nativeEvent.contentOffset.x / page), 0),
                photos.length - 1,
              );
              // Сообщаем только о смене фото, а не на каждый кадр прокрутки.
              if (next === latest.current.current) return;
              latest.current.current = next;
              setCurrent(next);
              latest.current.onIndexChange?.(next);
            }}
            style={{ width: page }}
            accessibilityHint={t('photos.closeHint')}
          >
            {photos.map((photo, i) => (
              // Фото не переставляются, пока открыт просмотр: индекс — ключ.
              <View key={i} style={[styles.page, { width: page, height }]}>
                <ApiImage
                  source={photo}
                  style={{ width, height }}
                  resizeMode="contain"
                  accessibilityLabel={t('photos.counter', {
                    current: i + 1,
                    count: photos.length,
                  })}
                />
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.top,
            { top: Math.max(insets.top, 12), opacity: chrome },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            hitSlop={8}
            onPress={() => close(0)}
            style={({ pressed }) => [styles.round, pressed && styles.pressed]}
          >
            <Icon name="close" size={14} color={theme.colors.white} />
          </Pressable>
          {several && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>
                {current + 1} / {photos.length}
              </Text>
            </View>
          )}
          <View style={styles.spacer} />
        </Animated.View>

        {several && (
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.dots,
              { bottom: Math.max(insets.bottom, 12) + 22, opacity: chrome },
            ]}
          >
            {photos.map((_, i) => (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={t('photos.counter', {
                  current: i + 1,
                  count: photos.length,
                })}
                hitSlop={6}
                onPress={() => goTo(i)}
              >
                <View style={[styles.dot, i === current && styles.dotActive]} />
              </Pressable>
            ))}
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: theme.colors.viewerBg,
  },
  page: {
    paddingRight: GAP,
  },
  top: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.viewerChrome,
  },
  pressed: {
    opacity: 0.7,
  },
  // Пустое место справа — чтобы счётчик стоял ровно по центру.
  spacer: {
    width: 44,
  },
  counter: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: theme.colors.viewerChrome,
  },
  counterText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  dotActive: {
    width: 20,
    backgroundColor: theme.colors.white,
  },
});
