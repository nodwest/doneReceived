import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@shared/theme';

/**
 * Нативная заглушка большой карты. Сама карта — ./map.web.tsx на DOM-версии
 * MapLibre: на iOS и Android её нет, а импорт этой библиотеки там бы упал.
 */
export function MapWeb() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.text}>The map is available in the web version</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: theme.colors.mapPlaceholder,
  },
  text: {
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});
