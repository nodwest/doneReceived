import { createContext, useCallback, useContext, useRef } from 'react';
import {
  Platform,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
  type View,
  type ViewStyle,
} from 'react-native';

/**
 * Стиль для ScrollView с `useKeepInView`. На вебе выключает привязку
 * прокрутки браузера (scroll anchoring): когда над полем в фокусе что-то
 * вставили, Chrome сам докручивает на высоту вставки — вместе с нашей
 * прокруткой выходит вдвое больше. Прокруткой управляет только хук.
 */
export const keepInViewScrollStyle = Platform.select({
  web: { overflowAnchor: 'none' },
}) as unknown as ViewStyle;

/** Сколько сейчас прокручено: на вебе — у самого DOM-узла, без задержки. */
function currentOffset(scroll: ScrollView, last: number) {
  if (Platform.OS !== 'web') return last;
  const node = (
    scroll as unknown as { getScrollableNode?: () => HTMLElement | null }
  ).getScrollableNode?.();
  return node ? node.scrollTop : last;
}

/** Докрутить так, чтобы низ элемента не ушёл за низ видимой части. */
export type KeepInView = (node: View) => void;

type Rect = { top: number; height: number };

/**
 * Где элемент на экране — сразу, без ожидания. На вебе `measureInWindow`
 * отвечает через setTimeout, уже после отрисовки: прокрутка опаздывает на
 * кадр, и содержимое моргает. Поэтому на вебе берём рамку DOM-узла сами. На
 * нативе (новая архитектура) `measureInWindow` и так синхронный.
 */
function measure(node: View, done: (rect: Rect) => void) {
  if (Platform.OS === 'web') {
    const rect = (node as unknown as HTMLElement).getBoundingClientRect();
    done({ top: rect.top, height: rect.height });
    return;
  }
  node.measureInWindow((_x, top, _width, height) => done({ top, height }));
}

/**
 * Прокрутка, которая держит элемент у нижнего края: когда содержимое над ним
 * выросло (новый шаг чеклиста, длинный комментарий) и он ушёл за низ, всё
 * сдвигается вверх, а сам элемент встаёт на `gap` выше края. Вызывать из
 * `useLayoutEffect` — тогда прокрутка успевает до отрисовки. Ручная прокрутка
 * работает как обычно.
 *
 * `viewportRef` — на View той же рамки, что и ScrollView (у ScrollView в
 * типах нет `measureInWindow`); самому ScrollView — `keepInViewScrollStyle`.
 */
export function useKeepInView(gap: number) {
  const scrollRef = useRef<ScrollView>(null);
  const viewportRef = useRef<View>(null);
  const scrollY = useRef(0);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.current = event.nativeEvent.contentOffset.y;
    },
    [],
  );

  const keepInView = useCallback<KeepInView>(
    (node) => {
      const scroll = scrollRef.current;
      const viewport = viewportRef.current;
      if (!scroll || !viewport) return;
      measure(viewport, (frame) =>
        measure(node, (rect) => {
          const overshoot =
            rect.top + rect.height + gap - (frame.top + frame.height);
          if (overshoot <= 0) return;
          scrollY.current = currentOffset(scroll, scrollY.current) + overshoot;
          scroll.scrollTo({ y: scrollY.current, animated: false });
        }),
      );
    },
    [gap],
  );

  return { scrollRef, viewportRef, onScroll, keepInView };
}

/** Прокрутка карточки для её секций; null — карточка не прокручивается. */
export const KeepInViewContext = createContext<KeepInView | null>(null);

export const useKeepInViewContext = () => useContext(KeepInViewContext);
