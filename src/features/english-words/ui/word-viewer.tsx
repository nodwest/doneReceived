import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  PanResponder,
  type PanResponderCallbacks,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { getWord, WORDS_TOTAL, WordCard } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { useViewerHint } from '../model/settings-store';
import { styles } from './words.styled';

type WordViewerProps = {
  /** Какое слово открыто; null — просмотр закрыт. */
  rank: number | null;
  /**
   * Листнули на другое слово (и когда карточка проявилась после открытия):
   * список под карточкой идёт следом.
   */
  onChange: (rank: number) => void;
  /** Закрыли — на каком слове остановились. */
  onClose: (rank: number) => void;
};

const useNativeDriver = Platform.OS !== 'web';
/** Сколько протянуть, чтобы листнуть или закрыть. */
const PAGE_DISTANCE = 70;
const CLOSE_DISTANCE = 110;
const FADE_MS = 180;
/** Сколько лента доезжает до соседней карточки после свайпа. */
const PAGE_MS = 220;

/**
 * Карточка любого слова поверх списка, без кнопок учёбы: перевод, примеры,
 * динамики. Влево и вправо — соседние слова по порядку, вверх или вниз —
 * закрыть (как и тап мимо карточки). Фон под карточкой размыт.
 */
export function WordViewer({ rank, onChange, onClose }: WordViewerProps) {
  return rank !== null ? (
    <Viewer initial={rank} onChange={onChange} onClose={onClose} />
  ) : null;
}

function Viewer({
  initial,
  onChange,
  onClose,
}: {
  initial: number;
  onChange: (rank: number) => void;
  onClose: (rank: number) => void;
}) {
  const { t } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [rank, setRank] = useState(initial);
  const [pan] = useState(() => new Animated.ValueXY());
  // Появление и закрытие — своей анимацией (у Modal её нет): закрытая
  // карточка уже прозрачна, когда Modal убирают, и ничего не моргает.
  const [fade] = useState(() => new Animated.Value(0));
  // Листнули: лента уже сдвинута на страницу — после смены слова вернуть её
  // в ноль до отрисовки, тогда соседняя карточка просто становится текущей.
  const paged = useRef(false);
  const axis = useRef<'x' | 'y' | null>(null);
  const busy = useRef(false);
  const hint = useViewerHint();

  // Обработчики жестов создаются один раз — свежие значения берут отсюда.
  const latest = useRef({ rank, width, height, onClose, onChange, hint });
  useEffect(() => {
    latest.current = { rank, width, height, onClose, onChange, hint };
  }, [rank, width, height, onClose, onChange, hint]);
  // Карточка проявилась полностью: до этого список под ней не трогаем —
  // иначе он прыгает, пока карточка ещё полупрозрачная.
  const shown = useRef(false);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: FADE_MS,
      useNativeDriver,
    }).start(() => {
      shown.current = true;
      latest.current.onChange(latest.current.rank);
    });
  }, [fade]);

  useEffect(() => {
    if (shown.current) onChange(rank);
  }, [rank, onChange]);

  useLayoutEffect(() => {
    if (!paged.current) return;
    paged.current = false;
    pan.setValue({ x: 0, y: 0 });
    busy.current = false;
  }, [rank, pan]);

  // dir: 1 — вниз, -1 — вверх, 0 — на месте (тап мимо, «назад»).
  const [close] = useState(() => (dir: -1 | 0 | 1) => {
    if (busy.current) return;
    busy.current = true;
    const done = () => latest.current.onClose(latest.current.rank);
    if (dir === 0) {
      // Тап мимо или «назад» — карточка и фон гаснут на месте.
      Animated.timing(fade, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver,
      }).start(done);
      return;
    }
    // Свайп — карточка улетает за край экрана, а фон гаснет вместе с ней
    // (его прозрачность привязана к сдвигу карточки).
    latest.current.hint.markClosed();
    Animated.timing(pan.y, {
      toValue: dir * latest.current.height,
      duration: 220,
      useNativeDriver,
    }).start(done);
  });

  const [handlers] = useState(() => {
    const back = () =>
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver,
        bounciness: 6,
      }).start();

    // dir: 1 — следующее слово (карточку увели влево), -1 — предыдущее.
    // Лента из трёх карточек доезжает на страницу — соседняя карточка
    // встаёт в центр, как фото в ленте.
    const page = (dir: 1 | -1) => {
      busy.current = true;
      latest.current.hint.markPaged();
      Animated.timing(pan.x, {
        toValue: -dir * latest.current.width,
        duration: PAGE_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }).start(() => {
        paged.current = true;
        setRank((value) => value + dir);
      });
    };

    const callbacks: PanResponderCallbacks = {
      // Захватываем и с динамика: тап по нему остаётся тапом, тянуть можно
      // с любого места карточки.
      onMoveShouldSetPanResponderCapture: (_, g) =>
        !busy.current && (Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8),
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (_, g) => {
        if (!axis.current) {
          axis.current = Math.abs(g.dx) > Math.abs(g.dy) ? 'x' : 'y';
        }
        if (axis.current === 'y') {
          pan.setValue({ x: 0, y: g.dy });
          return;
        }
        // У первого и последнего слова дальше не листается — тянется туго.
        const { rank: current } = latest.current;
        const edge =
          (g.dx > 0 && current <= 1) || (g.dx < 0 && current >= WORDS_TOTAL);
        pan.setValue({ x: edge ? g.dx * 0.25 : g.dx, y: 0 });
      },
      onPanResponderRelease: (_, g) => {
        const moved = axis.current;
        axis.current = null;
        const { rank: current } = latest.current;
        if (
          moved === 'y' &&
          (Math.abs(g.dy) > CLOSE_DISTANCE || Math.abs(g.vy) > 0.8)
        ) {
          close(g.dy > 0 ? 1 : -1);
        } else if (
          moved === 'x' &&
          (Math.abs(g.dx) > PAGE_DISTANCE || Math.abs(g.vx) > 0.5)
        ) {
          const dir = g.dx < 0 ? 1 : -1;
          const next = current + dir;
          if (next >= 1 && next <= WORDS_TOTAL) page(dir);
          else back();
        } else {
          back();
        }
      },
      onPanResponderTerminate: () => {
        axis.current = null;
        back();
      },
    };
    return callbacks;
  });
  const [responder] = useState(() => PanResponder.create(handlers));

  const word = getWord(rank);
  if (!word) return null;

  // Фон гаснет равномерно с тем, как карточку уводят к краю: у края — ноль.
  const backdropFade = Animated.multiply(
    fade,
    pan.y.interpolate({
      inputRange: [-height, 0, height],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
  );

  // Подсказка гаснет с первых пикселей свайпа вверх или вниз: карточка не
  // проходит сквозь неё.
  const hintFade = Animated.multiply(
    fade,
    pan.y.interpolate({
      inputRange: [-24, 0, 24],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
  );

  const go = (dir: 1 | -1) => {
    const next = rank + dir;
    if (next >= 1 && next <= WORDS_TOTAL) setRank(next);
  };

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => close(0)}
    >
      {/* Прозрачность — у фона и карточки по отдельности, не у общего
          родителя: под полупрозрачным родителем размытие в вебе не работает. */}
      <View style={styles.viewer}>
        <Animated.View
          style={[styles.viewerBackdrop, { opacity: backdropFade }]}
        >
          <Pressable
            style={styles.viewerBackdropPress}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            onPress={() => close(0)}
          />
        </Animated.View>
        {/* Лента: предыдущая, текущая и следующая карточки по странице на
            экран; свайп двигает всю ленту, соседняя тянется из-за края. */}
        <Animated.View
          {...responder.panHandlers}
          // Касания мимо текущей карточки проходят к фону: тап сбоку закрывает.
          pointerEvents="box-none"
          style={[
            styles.viewerStrip,
            { width: width * 3 },
            {
              opacity: fade,
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
          ]}
          accessibilityActions={[
            { name: 'increment', label: t('words.viewer.next') },
            { name: 'decrement', label: t('words.viewer.previous') },
            { name: 'escape' },
          ]}
          onAccessibilityAction={(event) => {
            const action = event.nativeEvent.actionName;
            if (action === 'increment') go(1);
            if (action === 'decrement') go(-1);
            if (action === 'escape') close(0);
          }}
          onAccessibilityEscape={() => close(0)}
        >
          {[rank - 1, rank, rank + 1].map((item) => {
            const pageWord = getWord(item);
            const current = item === rank;
            return (
              <View
                key={item}
                style={[styles.viewerPage, { width }]}
                pointerEvents={current ? 'auto' : 'none'}
                importantForAccessibility={
                  current ? 'auto' : 'no-hide-descendants'
                }
                accessibilityElementsHidden={!current}
              >
                {pageWord ? (
                  <WordCard
                    word={pageWord}
                    style={{ width: Math.min(width - 32, 480) }}
                  />
                ) : null}
              </View>
            );
          })}
        </Animated.View>
        {/* Подсказка жестов значками, пока ребёнок не попробовал оба жеста. */}
        {hint.show ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.viewerHint, { opacity: hintFade }]}
          >
            <View style={styles.viewerHintItem}>
              <Icon
                name="swipe-horizontal"
                size={22}
                color={theme.colors.grey}
              />
              <Text style={styles.viewerHintText}>
                {t('words.viewer.hintPage')}
              </Text>
            </View>
            <View style={styles.viewerHintItem}>
              <Icon name="swipe-vertical" size={22} color={theme.colors.grey} />
              <Text style={styles.viewerHintText}>
                {t('words.viewer.hintClose')}
              </Text>
            </View>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}
