import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import type { GeoPoint } from '@entities/user';
import { theme } from '@shared/theme';

/**
 * Нативной карты пока нет (виджет построен на DOM-версии MapLibre): вместо
 * мини-карты — заглушка цвета карты, пин и подпись рисует превью поверх.
 * Веб-версия — ./mini-map.web.tsx.
 */
export const MiniMap: (props: { center: GeoPoint }) => ReactElement = () => (
  <View style={styles.placeholder} />
);

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: theme.colors.mapPlaceholder,
  },
});
