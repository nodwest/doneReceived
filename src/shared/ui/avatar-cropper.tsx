import { useEffect, useRef, useState } from 'react';
import {
  Image,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type GestureResponderEvent,
  type PanResponderCallbacks,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from '../i18n';
import { cropPhoto, showToast, type PickedPhoto } from '../lib';
import { theme, tracking } from '../theme';
import { GradientButton } from './gradient-button';
import { Icon } from './icons';

/** Во сколько раз можно увеличить фото сверх «круг закрыт целиком». */
const MAX_ZOOM = 4;
/** Шаг кнопок «−» и «+» по полосе масштаба. */
const ZOOM_STEP = 0.2;
const MAX_CIRCLE = 340;
// Отступы круга от краёв экрана и место под подсказкой.
const SIDE_GAP = 36;
const HINT_SPACE = 56;
const TOP_BAR = 60;

type AvatarCropperProps = {
  /** Выбранное фото; null — экран закрыт. */
  photo: PickedPhoto | null;
  /** Обрезанное фото загружается: спиннер на кнопке, остальное неактивно. */
  saving?: boolean;
  onCancel: () => void;
  /** Квадрат, вырезанный по кругу (JPEG до 1024×1024). */
  onConfirm: (cropped: PickedPhoto) => void;
};

/**
 * Обрезка аватарки: фото под пунктирным кругом, вокруг затемнение. Двумя
 * пальцами — масштаб, одним — сдвиг; ещё полоса масштаба с «−» и «+». Круг
 * всегда закрыт фото целиком. На сервер уходит квадрат вокруг круга.
 */
export function AvatarCropper({
  photo,
  saving = false,
  onCancel,
  onConfirm,
}: AvatarCropperProps) {
  if (!photo) return null;
  // Новое фото — новое содержимое: масштаб и сдвиг с нуля.
  return (
    <CropperContent
      key={photo.uri}
      photo={photo}
      saving={saving}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}

type Offset = { x: number; y: number };
type View2D = { zoom: number; offset: Offset };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const touchDistance = (event: GestureResponderEvent) => {
  const [a, b] = event.nativeEvent.touches;
  return Math.hypot(a.pageX - b.pageX, a.pageY - b.pageY);
};

function CropperContent({
  photo,
  saving,
  onCancel,
  onConfirm,
}: Required<AvatarCropperProps> & { photo: PickedPhoto }) {
  const { t } = useTranslation();
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState(
    photo.width && photo.height
      ? { width: photo.width, height: photo.height }
      : null,
  );
  const [controlsTop, setControlsTop] = useState(0);
  const [view, setView] = useState<View2D>({
    zoom: 1,
    offset: { x: 0, y: 0 },
  });
  const [cropping, setCropping] = useState(false);
  const busy = saving || cropping;

  // Размер фото неизвестен (не с камеры и не из галереи) — спрашиваем.
  useEffect(() => {
    if (size) return;
    Image.getSize(photo.uri, (width, height) => setSize({ width, height }));
  }, [photo.uri, size]);

  // Круг — между шапкой и кнопками, под ним место для подсказки.
  const top = insets.top + TOP_BAR;
  const bottom = controlsTop || window.height - insets.bottom - 180;
  const diameter = Math.max(
    Math.min(
      window.width - SIDE_GAP * 2,
      bottom - top - HINT_SPACE * 2,
      MAX_CIRCLE,
    ),
    120,
  );
  const center = {
    x: window.width / 2,
    y: top + (bottom - top - HINT_SPACE) / 2,
  };
  // Масштаб, при котором короткая сторона фото ровно закрывает круг.
  const base = size ? diameter / Math.min(size.width, size.height) : 1;

  // Сдвиг не даёт краю фото зайти внутрь круга.
  const limit = (next: View2D): View2D => {
    if (!size) return next;
    const zoom = clamp(next.zoom, 1, MAX_ZOOM);
    const maxX = (size.width * base * zoom - diameter) / 2;
    const maxY = (size.height * base * zoom - diameter) / 2;
    return {
      zoom,
      offset: {
        x: clamp(next.offset.x, -maxX, maxX),
        y: clamp(next.offset.y, -maxY, maxY),
      },
    };
  };

  // Масштаб вокруг центра круга: точка фото в центре остаётся на месте.
  const zoomTo = (from: View2D, zoom: number): View2D => {
    const next = clamp(zoom, 1, MAX_ZOOM);
    const ratio = next / from.zoom;
    return limit({
      zoom: next,
      offset: { x: from.offset.x * ratio, y: from.offset.y * ratio },
    });
  };

  // Обработчики жестов создаются один раз — свежие значения берут отсюда.
  const latest = useRef({ view, busy, limit, zoomTo });
  useEffect(() => {
    latest.current = { view, busy, limit, zoomTo };
  });
  const gesture = useRef({
    start: view,
    // Палец, который двигает фото: с какого dx/dy считаем сдвиг.
    origin: { dx: 0, dy: 0 },
    pinch: null as null | { distance: number; from: View2D },
  });

  const apply = (next: View2D) => {
    latest.current.view = next;
    setView(next);
  };

  const [handlers] = useState<PanResponderCallbacks>(() => ({
    onStartShouldSetPanResponder: () => !latest.current.busy,
    onMoveShouldSetPanResponder: () => !latest.current.busy,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => {
      gesture.current = {
        start: latest.current.view,
        origin: { dx: 0, dy: 0 },
        pinch: null,
      };
    },
    onPanResponderMove: (event, { dx, dy }) => {
      const state = gesture.current;
      if (event.nativeEvent.touches.length >= 2) {
        const distance = touchDistance(event);
        if (!state.pinch) {
          state.pinch = { distance, from: latest.current.view };
          return;
        }
        if (state.pinch.distance > 0) {
          apply(
            latest.current.zoomTo(
              state.pinch.from,
              state.pinch.from.zoom * (distance / state.pinch.distance),
            ),
          );
        }
        return;
      }
      // Второй палец отпустили — сдвиг продолжается от текущего места.
      if (state.pinch) {
        state.pinch = null;
        state.start = latest.current.view;
        state.origin = { dx, dy };
      }
      apply(
        latest.current.limit({
          zoom: state.start.zoom,
          offset: {
            x: state.start.offset.x + dx - state.origin.dx,
            y: state.start.offset.y + dy - state.origin.dy,
          },
        }),
      );
    },
  }));
  const [responder] = useState(() => PanResponder.create(handlers));

  // Полоса масштаба — в логарифмах: каждый шаг увеличивает одинаково заметно.
  const position = Math.log(view.zoom) / Math.log(MAX_ZOOM);
  const zoomAt = (value: number) => MAX_ZOOM ** clamp(value, 0, 1);
  const setPosition = (value: number) =>
    apply(zoomTo(latest.current.view, zoomAt(value)));

  const confirm = async () => {
    if (!size || busy) return;
    const scale = base * view.zoom;
    const side = diameter / scale;
    setCropping(true);
    try {
      const cropped = await cropPhoto(
        { ...photo, width: size.width, height: size.height },
        {
          originX: size.width / 2 - view.offset.x / scale - side / 2,
          originY: size.height / 2 - view.offset.y / scale - side / 2,
          size: side,
        },
      );
      onConfirm(cropped);
    } catch {
      showToast(t('photos.pickFailed'));
    } finally {
      setCropping(false);
    }
  };

  const shown = size && {
    width: size.width * base * view.zoom,
    height: size.height * base * view.zoom,
  };
  // Рамка вокруг круга шире экрана: её толстая граница и есть затемнение.
  const frame = Math.hypot(window.width, window.height);

  return (
    <Modal
      visible
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => !busy && onCancel()}
    >
      <StatusBar style="light" />
      <View style={styles.root} {...responder.panHandlers}>
        {shown && (
          <Image
            source={{ uri: photo.uri }}
            accessibilityIgnoresInvertColors
            style={{
              position: 'absolute',
              width: shown.width,
              height: shown.height,
              left: center.x + view.offset.x - shown.width / 2,
              top: center.y + view.offset.y - shown.height / 2,
            }}
          />
        )}
        <View
          pointerEvents="none"
          style={[
            styles.scrim,
            {
              width: diameter + frame * 2,
              height: diameter + frame * 2,
              borderRadius: diameter / 2 + frame,
              borderWidth: frame,
              left: center.x - diameter / 2 - frame,
              top: center.y - diameter / 2 - frame,
            },
          ]}
        />
        <Svg
          pointerEvents="none"
          width={diameter + 4}
          height={diameter + 4}
          style={{
            position: 'absolute',
            left: center.x - diameter / 2 - 2,
            top: center.y - diameter / 2 - 2,
          }}
        >
          <Circle
            cx={diameter / 2 + 2}
            cy={diameter / 2 + 2}
            r={diameter / 2 + 1}
            stroke={theme.colors.white}
            strokeWidth={2}
            strokeDasharray="10 8"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
        {!busy && (
          <Text
            pointerEvents="none"
            style={[styles.hint, { top: center.y + diameter / 2 + 24 }]}
          >
            {t('avatarCrop.hint')}
          </Text>
        )}
      </View>

      <View
        pointerEvents="box-none"
        style={[styles.top, { top: insets.top + 8 }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          disabled={busy}
          hitSlop={8}
          onPress={onCancel}
          style={({ pressed }) => [
            styles.round,
            busy && styles.inactive,
            pressed && styles.pressed,
          ]}
        >
          <Icon name="close" size={14} color={theme.colors.white} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {t('avatarCrop.title')}
        </Text>
        <View style={styles.spacer} />
      </View>

      <View
        style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}
        onLayout={({ nativeEvent }) => setControlsTop(nativeEvent.layout.y)}
      >
        <View style={[styles.zoomRow, busy && styles.inactive]}>
          <ZoomButton
            icon="minus"
            label={t('avatarCrop.zoomOut')}
            disabled={busy}
            onPress={() => setPosition(position - ZOOM_STEP)}
          />
          <ZoomSlider
            value={position}
            disabled={busy}
            label={t('avatarCrop.zoom')}
            onChange={setPosition}
          />
          <ZoomButton
            icon="plus"
            label={t('avatarCrop.zoomIn')}
            disabled={busy}
            onPress={() => setPosition(position + ZOOM_STEP)}
          />
        </View>
        <GradientButton
          label={busy ? t('avatarCrop.saving') : t('avatarCrop.usePhoto')}
          loading={busy}
          disabled={!size}
          onPress={confirm}
        />
      </View>
    </Modal>
  );
}

type ZoomButtonProps = {
  icon: 'minus' | 'plus';
  label: string;
  disabled: boolean;
  onPress: () => void;
};

function ZoomButton({ icon, label, disabled, onPress }: ZoomButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}
    >
      <View style={styles.bar} />
      {icon === 'plus' && <View style={[styles.bar, styles.barVertical]} />}
    </Pressable>
  );
}

type ZoomSliderProps = {
  /** 0…1 */
  value: number;
  disabled: boolean;
  label: string;
  onChange: (value: number) => void;
};

const THUMB = 24;

/** Полоса масштаба: тянуть ползунок или нажать в любое место полосы. */
function ZoomSlider({ value, disabled, label, onChange }: ZoomSliderProps) {
  const [width, setWidth] = useState(0);
  const latest = useRef({ width, value, disabled, onChange });
  useEffect(() => {
    latest.current = { width, value, disabled, onChange };
  });
  const start = useRef(0);
  const usable = () => Math.max(latest.current.width - THUMB, 1);

  const [handlers] = useState<PanResponderCallbacks>(() => ({
    onStartShouldSetPanResponder: () => !latest.current.disabled,
    onMoveShouldSetPanResponder: () => !latest.current.disabled,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: ({ nativeEvent }) => {
      start.current = (nativeEvent.locationX - THUMB / 2) / usable();
      latest.current.onChange(start.current);
    },
    onPanResponderMove: (_, { dx }) =>
      latest.current.onChange(start.current + dx / usable()),
  }));
  const [responder] = useState(() => PanResponder.create(handlers));
  const x = clamp(value, 0, 1) * Math.max(width - THUMB, 0);

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={({ nativeEvent }) =>
        onChange(
          value + (nativeEvent.actionName === 'increment' ? 1 : -1) * ZOOM_STEP,
        )
      }
      style={styles.slider}
      onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
      {...responder.panHandlers}
    >
      <View pointerEvents="none" style={styles.track} />
      <LinearGradient
        pointerEvents="none"
        colors={[theme.colors.violet, theme.colors.blue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.track, styles.trackFill, { width: x + THUMB / 2 }]}
      />
      <View pointerEvents="none" style={[styles.thumb, { left: x }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    backgroundColor: theme.colors.viewerBg,
  },
  scrim: {
    position: 'absolute',
    borderColor: theme.colors.viewerScrim,
  },
  hint: {
    position: 'absolute',
    left: 24,
    right: 24,
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  top: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  round: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.viewerChrome,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  // Пустое место справа — чтобы заголовок стоял ровно по центру.
  spacer: {
    width: 44,
  },
  pressed: {
    opacity: 0.7,
  },
  inactive: {
    opacity: 0.4,
  },
  controls: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 0,
    gap: 36,
  },
  zoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.viewerChrome,
  },
  bar: {
    position: 'absolute',
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: theme.colors.white,
  },
  barVertical: {
    width: 2,
    height: 12,
  },
  slider: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  trackFill: {
    right: undefined,
  },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
  },
});
