import { Platform } from 'react-native';

/**
 * Как назвать это устройство в списке устройств ребёнка у родителя: модель
 * на Android, тип устройства на iOS, браузер и система в вебе. Без нативных
 * модулей — только то, что знает React Native.
 */
export function deviceLabel(): string {
  if (Platform.OS === 'web') return webLabel();
  if (Platform.OS === 'android') {
    const { Brand, Model } = Platform.constants as {
      Brand?: string;
      Model?: string;
    };
    if (Model)
      return Brand && !Model.startsWith(Brand)
        ? `${capitalize(Brand)} ${Model}`
        : Model;
    return 'Android';
  }
  if (Platform.OS === 'ios') {
    const { interfaceIdiom } = Platform.constants as {
      interfaceIdiom?: string;
    };
    return interfaceIdiom === 'pad' ? 'iPad' : 'iPhone';
  }
  return 'Device';
}

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/** «Chrome · macOS» по user agent браузера. */
function webLabel(): string {
  const agent = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  const browser = /Edg\//.test(agent)
    ? 'Edge'
    : /OPR\//.test(agent)
      ? 'Opera'
      : /Firefox\//.test(agent)
        ? 'Firefox'
        : /Chrome\//.test(agent)
          ? 'Chrome'
          : /Safari\//.test(agent)
            ? 'Safari'
            : 'Browser';
  const system = /iPhone|iPad/.test(agent)
    ? 'iOS'
    : /Android/.test(agent)
      ? 'Android'
      : /Mac OS X/.test(agent)
        ? 'macOS'
        : /Windows/.test(agent)
          ? 'Windows'
          : /Linux/.test(agent)
            ? 'Linux'
            : null;
  return system ? `${browser} · ${system}` : browser;
}
