import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

// Отступ под кнопками равен отступу над ними (как в макете).
export const NAV_PADDING_VERTICAL = 12;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: NAV_PADDING_VERTICAL,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  labelActive: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
});
