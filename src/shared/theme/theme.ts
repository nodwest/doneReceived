import { StyleSheet } from 'react-native';
import { palettes, type ThemeColors, type ThemeMode } from './colors';
import { loadStoredTheme } from './theme-storage';

// Тема выбирается на устройстве, как язык: сохранили — и следующий запуск
// рисуется сразу в ней, без вспышки светлого экрана.
let currentMode: ThemeMode = loadStoredTheme();

/** Текущий режим темы. Меняется только через setThemeMode из theme-store. */
export function getThemeMode(): ThemeMode {
  return currentMode;
}

export function setThemeModeValue(mode: ThemeMode) {
  currentMode = mode;
}

export function getThemeColors(): ThemeColors {
  return palettes[currentMode];
}

/**
 * Стили, которые пересобираются при смене темы. Фабрика получает палитру,
 * поэтому в ней нельзя ссылаться на `theme.colors`: цвета приходят
 * параметром `colors`, а межбуквенные интервалы, шрифты и отступы — из
 * `theme`, они от темы не зависят.
 *
 * `styles.foo` возвращает готовый объект для текущей темы — читать его нужно
 * во время рендера, как обычный StyleSheet.
 */
export function createStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ThemeColors) => T,
): T {
  const cache: Partial<Record<ThemeMode, T>> = {};
  return new Proxy({} as T, {
    get(_target, key) {
      const sheet =
        cache[currentMode] ??
        (cache[currentMode] = StyleSheet.create(
          factory(palettes[currentMode]),
        ));
      return Reflect.get(sheet, key);
    },
  });
}

/**
 * Карта цветов, которая читает палитру при обращении. Нужна для словарей
 * вида `{ pending: [reviewFrom, reviewTo], ... }` на уровне модуля: обычный
 * объект запомнил бы светлые цвета навсегда.
 *
 * Возвращается настоящий объект с геттерами на ключах, а не Proxy: так он
 * ведёт себя как обычный словарь и для нативных компонентов, и для
 * `Object.keys`/spread.
 */
export function themedValue<T extends object>(factory: () => T): T {
  const seed = factory();
  const object = {} as T;
  for (const key of Object.keys(seed) as (keyof T)[]) {
    Object.defineProperty(object, key, {
      enumerable: true,
      configurable: true,
      get: () => factory()[key],
    });
  }
  return object;
}

/**
 * То же для массивов: градиенты, наборы цветов, кортежи. Возвращается
 * настоящий массив, у элементов которого стоят геттеры: нативные компоненты
 * читают такие массивы через `map`/`filter`, а Proxy с пустой целью выдавал
 * бы им дырки вместо цветов (LinearGradient на Android падал с NPE).
 */
export function themedArray<T extends readonly string[]>(factory: () => T): T {
  const length = factory().length;
  const array: string[] = [];
  for (let index = 0; index < length; index++) {
    Object.defineProperty(array, index, {
      enumerable: true,
      configurable: true,
      get: () => factory()[index],
    });
  }
  return array as unknown as T;
}

export const theme = {
  get colors(): ThemeColors {
    return getThemeColors();
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 999,
  },
  fonts: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extrabold: 'Inter_800ExtraBold',
  },
  fontSize: {
    xs: 12,
    inputName: 13,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    h1: 28,
  },
};
