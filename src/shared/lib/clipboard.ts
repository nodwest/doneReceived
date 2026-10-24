import * as Clipboard from 'expo-clipboard';

/** Скопировать текст в буфер обмена (iOS, Android и веб). */
export const copyText = (text: string) => Clipboard.setStringAsync(text);
