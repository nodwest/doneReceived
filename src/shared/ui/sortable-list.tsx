import {
  useLayoutEffect,
  useRef,
  useState,
  type Key,
  type ReactNode,
} from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type GestureResponderHandlers,
  type PanResponderCallbacks,
} from 'react-native';

const SHIFT_MS = 150;

type Layout = { y: number; height: number };

/** Общий для элементов списка ход перетаскивания. */
type Controller = {
  /** Элемент появился: его сдвиг, чтобы раздвигать соседей. */
  register: (key: Key, shift: Animated.Value) => () => void;
  /** Где элемент лежит в списке (без сдвигов). */
  measure: (key: Key, layout: Layout) => void;
  start: (key: Key) => void;
  move: (key: Key, dy: number) => void;
  end: () => void;
};

type RenderArgs<T> = {
  item: T;
  index: number;
  /** Повесить на ручку: за неё элемент и перетаскивают. */
  dragHandleProps: GestureResponderHandlers;
  /** Этот элемент сейчас перетаскивают. */
  dragging: boolean;
};

type SortableListProps<T> = {
  data: readonly T[];
  keyExtractor: (item: T) => Key;
  renderItem: (args: RenderArgs<T>) => ReactNode;
  /**
   * Элемент отпустили на новом месте. Родитель сразу меняет порядок в
   * данных (оптимистично): до этого элемент остаётся там, где его отпустили.
   */
  onReorder: (from: number, to: number) => void;
  /** Перетаскивание началось или кончилось: например, выключить прокрутку. */
  onDragActiveChange?: (active: boolean) => void;
  gap?: number;
};

/**
 * Вертикальный список, который сортируют перетаскиванием за ручку: элемент
 * едет за пальцем, соседи расступаются, на отпускании порядок меняется.
 * Элементы могут быть разной высоты.
 */
export function SortableList<T>({
  data,
  keyExtractor,
  renderItem,
  onReorder,
  onDragActiveChange,
  gap = 0,
}: SortableListProps<T>) {
  const [draggingKey, setDraggingKey] = useState<Key | null>(null);
  const [dragY] = useState(() => new Animated.Value(0));
  const keys = data.map(keyExtractor);
  // Свежие пропсы для обработчиков жеста, которые создаются один раз.
  const latest = useRef({ keys, gap, onReorder, onDragActiveChange });
  useLayoutEffect(() => {
    latest.current = { keys, gap, onReorder, onDragActiveChange };
  });
  const shifts = useRef(new Map<Key, Animated.Value>());
  const layouts = useRef(new Map<Key, Layout>());
  // Откуда и куда тянут; awaitingData — порядок поменяли, ждём новых данных,
  // чтобы снять сдвиги без скачка.
  const drag = useRef({ from: -1, to: -1, awaitingData: false });

  // Новый порядок отрисован: элементы уже на своих местах, сдвиги не нужны.
  useLayoutEffect(() => {
    if (!drag.current.awaitingData) return;
    drag.current.awaitingData = false;
    dragY.setValue(0);
    shifts.current.forEach((shift) => shift.setValue(0));
    setDraggingKey(null);
  }, [data, dragY]);

  const [controller] = useState<Controller>(() => ({
    register: (key, shift) => {
      shifts.current.set(key, shift);
      return () => {
        shifts.current.delete(key);
        layouts.current.delete(key);
      };
    },
    measure: (key, layout) => {
      layouts.current.set(key, layout);
    },
    start: (key) => {
      const from = latest.current.keys.indexOf(key);
      drag.current = { from, to: from, awaitingData: false };
      dragY.setValue(0);
      setDraggingKey(key);
      latest.current.onDragActiveChange?.(true);
    },
    move: (key, dy) => {
      dragY.setValue(dy);
      const { keys: order, gap: space } = latest.current;
      const own = layouts.current.get(key);
      if (!own) return;
      const center = own.y + own.height / 2 + dy;
      // Новое место — сколько соседей оказалось выше середины элемента.
      const to = order.filter((other) => {
        const layout = layouts.current.get(other);
        return other !== key && layout && layout.y + layout.height / 2 < center;
      }).length;
      if (to === drag.current.to) return;
      drag.current.to = to;
      const { from } = drag.current;
      const step = own.height + space;
      // Соседи между старым и новым местом расступаются на высоту элемента.
      order.forEach((other, index) => {
        const shift = shifts.current.get(other);
        if (other === key || !shift) return;
        let target = 0;
        if (from < to && index > from && index <= to) target = -step;
        if (from > to && index >= to && index < from) target = step;
        Animated.timing(shift, {
          toValue: target,
          duration: SHIFT_MS,
          useNativeDriver: false,
        }).start();
      });
    },
    end: () => {
      const { from, to } = drag.current;
      latest.current.onDragActiveChange?.(false);
      if (from === -1) return;
      drag.current = { from: -1, to: -1, awaitingData: to !== from };
      if (to === from) {
        Animated.timing(dragY, {
          toValue: 0,
          duration: SHIFT_MS,
          useNativeDriver: false,
        }).start(() => setDraggingKey(null));
        return;
      }
      latest.current.onReorder(from, to);
    },
  }));

  return (
    <View style={{ gap }}>
      {data.map((item, index) => {
        const key = keys[index];
        const dragging = key === draggingKey;
        return (
          <SortableItem
            key={key}
            itemKey={key}
            controller={controller}
            dragging={dragging}
            dragY={dragY}
          >
            {(dragHandleProps) =>
              renderItem({ item, index, dragHandleProps, dragging })
            }
          </SortableItem>
        );
      })}
    </View>
  );
}

type SortableItemProps = {
  itemKey: Key;
  controller: Controller;
  dragging: boolean;
  /** Сдвиг перетаскиваемого элемента — общий, его двигает палец. */
  dragY: Animated.Value;
  children: (dragHandleProps: GestureResponderHandlers) => ReactNode;
};

/** Элемент списка: свой сдвиг, своё место и жест ручки. */
function SortableItem({
  itemKey,
  controller,
  dragging,
  dragY,
  children,
}: SortableItemProps) {
  const [shift] = useState(() => new Animated.Value(0));
  useLayoutEffect(
    () => controller.register(itemKey, shift),
    [controller, itemKey, shift],
  );
  const [handlers] = useState<PanResponderCallbacks>(() => ({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => controller.start(itemKey),
    onPanResponderMove: (_, { dy }) => controller.move(itemKey, dy),
    onPanResponderRelease: () => controller.end(),
    onPanResponderTerminate: () => controller.end(),
  }));
  const [responder] = useState(() => PanResponder.create(handlers));

  return (
    <Animated.View
      onLayout={({ nativeEvent: { layout } }) =>
        controller.measure(itemKey, { y: layout.y, height: layout.height })
      }
      style={[
        dragging && styles.dragging,
        { transform: [{ translateY: dragging ? dragY : shift }] },
      ]}
    >
      {children(responder.panHandlers)}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Перетаскиваемый элемент — поверх соседей.
  dragging: {
    zIndex: 10,
  },
});
