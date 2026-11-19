import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

// Отступ под кнопками равен отступу над ними (как в макете).
export const NAV_PADDING_VERTICAL = 12;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: NAV_PADDING_VERTICAL,
    // Семь вкладок: на 320pt подписи должны помещаться без переносов.
    paddingHorizontal: 12,
    backgroundColor: theme.colors.white,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  // Нажатие видно сразу: переключение вкладки идёт без свайпа, и отклик важнее.
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 10,
    letterSpacing: tracking(10),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  // Цвет задаёт выбранная вкладка (синий приложения) — здесь только жирность.
  labelActive: {
    fontFamily: theme.fonts.bold,
  },
});
