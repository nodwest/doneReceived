import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme, tracking } from '@shared/theme';

/**
 * Нативная заглушка большой карты. Сама карта — ./map.web.tsx на DOM-версии
 * MapLibre: на iOS и Android её нет, а импорт этой библиотеки там бы упал.
 */
export function MapWeb() {
  const { t } = useTranslation();
  return (
    <View style={styles.placeholder}>
      <Text style={styles.text}>{t('map.webOnly')}</Text>
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
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});
