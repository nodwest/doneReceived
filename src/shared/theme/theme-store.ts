import { useSyncExternalStore } from 'react';
import { Appearance, Platform } from 'react-native';
import { palettes, type ThemeMode } from './colors';
import { getThemeMode, setThemeModeValue } from './theme';
import { saveStoredTheme } from './theme-storage';

const listeners = new Set<() => void>();

/** Нативная часть темы: статус-бар, клавиатура, системные диалоги. */
export function syncNativeAppearance() {
  const mode = getThemeMode();
  try {
    // Не все платформы умеют программно менять схему: на вебе это просто
    // подсказка браузеру, на нативе — настройка окон и контроля.
    Appearance.setColorScheme(mode);
  } catch {
    // Старые версии и web-рендерер могут не знать метода — цвета интерфейса
    // от этого не зависят.
  }
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.documentElement.style.colorScheme = mode;
    document.documentElement.style.backgroundColor = palettes[mode].prime;
  }
}

export function setThemeMode(mode: ThemeMode) {
  if (mode === getThemeMode()) return;
  setThemeModeValue(mode);
  saveStoredTheme(mode);
  syncNativeAppearance();
  for (const listener of listeners) listener();
}

export function toggleThemeMode() {
  setThemeMode(getThemeMode() === 'dark' ? 'light' : 'dark');
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Текущая тема и способ её переключить. Компонент, который вызвал хук,
 * перерисуется при смене темы; после перерисовки `theme.colors` и `styles`
 * из createStyles уже отдают новую палитру.
 */
export function useTheme() {
  const mode = useSyncExternalStore(subscribe, getThemeMode, getThemeMode);
  return {
    mode,
    isDark: mode === 'dark',
    colors: palettes[mode],
    setMode: setThemeMode,
    toggle: toggleThemeMode,
  };
}
