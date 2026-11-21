import * as Speech from 'expo-speech';

/**
 * Произнести текст встроенным синтезом речи телефона (в вебе — браузера):
 * без интернета и сторонних сервисов. Новая фраза обрывает прежнюю, чтобы
 * частые нажатия не копили очередь. `expo-speech` — нативный модуль: после
 * установки нужен новый dev-билд.
 */
export function speak(text: string, language = 'en-US') {
  Speech.stop();
  Speech.speak(text, { language, rate: 0.85 });
}

/** Замолчать: уходим с экрана или меняется карточка. */
export function stopSpeaking() {
  Speech.stop();
}
