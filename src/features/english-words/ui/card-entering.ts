import {
  Easing,
  FadeInRight,
  FadeOutLeft,
  ReduceMotion,
} from 'react-native-reanimated';

/**
 * Смена карточки слова (учёба и проверка) — переход «общая ось X» из
 * Material motion, как у шагов и флешкарт: старая карточка уходит влево и
 * тает, новая чуть позже выезжает справа и проявляется.
 *
 * Только готовые анимации, без `withInitialValues` и своих функций: в вебе
 * Reanimated после окончания «нестандартной» анимации входа ставит элементу
 * `position: absolute` (снимок позиции), карточка выпадает из потока и
 * подсказка под ней уезжает наверх. При «Уменьшить движение» в системе — без
 * анимации.
 */

/** Уходящая карточка — быстро, с ускорением: уступает место новой. */
const EXIT_MS = 150;
/** Новая — с замедлением к концу; начинает, когда старая почти ушла. */
const ENTER_DELAY_MS = 100;
const ENTER_MS = 300;

export const cardExiting = FadeOutLeft.duration(EXIT_MS)
  .easing(Easing.bezier(0.4, 0, 1, 1))
  .reduceMotion(ReduceMotion.System);

export const cardEntering = FadeInRight.delay(ENTER_DELAY_MS)
  .duration(ENTER_MS)
  .easing(Easing.bezier(0, 0, 0.2, 1))
  .reduceMotion(ReduceMotion.System);
