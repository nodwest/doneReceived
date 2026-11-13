import { useCallback, useEffect, useRef, useState } from 'react';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/** Сколько видно зелёное: новый код и «New code is ready». */
const FRESH_MS = 3000;
/** Последнюю секунду из них зелёное плавно гаснет. */
const FADE_MS = 1000;
/** Как быстро возвращаются подсказка и Reset code. */
const APPEAR_MS = 280;

const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

/**
 * «Новый код готов» после сброса. `fresh` — 3 секунды после сброса:
 * видно зелёное, а подсказки и Reset code нет (чтобы не сбрасывали код
 * очередями). `glow` — непрозрачность зелёного: горит 2 с, последнюю
 * секунду гаснет. `appear` — проявление подсказки и Reset code, когда
 * зелёное погасло (0 → 1). Смену состояния ведёт таймер, а не конец
 * анимации: так подсказка вернётся, даже если анимация не доиграет.
 * Прозрачность меняем и при «Уменьшить движение» — она ничего не двигает.
 */
export function useNewCodeGlow() {
  const glow = useSharedValue(0);
  const appear = useSharedValue(1);
  const [fresh, setFresh] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setFresh(true);
    cancelAnimation(glow);
    cancelAnimation(appear);
    appear.set(0);
    glow.set(1);
    glow.set(
      withDelay(
        FRESH_MS - FADE_MS,
        withTiming(0, {
          duration: FADE_MS,
          easing: EASE_IN_OUT,
          reduceMotion: ReduceMotion.Never,
        }),
        ReduceMotion.Never,
      ),
    );
    timer.current = setTimeout(() => {
      timer.current = null;
      setFresh(false);
      appear.set(
        withTiming(1, {
          duration: APPEAR_MS,
          easing: EASE_OUT,
          reduceMotion: ReduceMotion.Never,
        }),
      );
    }, FRESH_MS);
  }, [appear, glow]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      cancelAnimation(glow);
      cancelAnimation(appear);
    },
    [appear, glow],
  );

  return { glow, appear, fresh, start };
}
