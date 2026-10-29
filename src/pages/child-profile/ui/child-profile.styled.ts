import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  body: {
    gap: 20,
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  // Карточки вишлиста в ленте одной высоты: короткая — с содержимым по центру.
  wish: {
    justifyContent: 'center',
  },
  list: {
    gap: 6,
  },
  empty: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});
