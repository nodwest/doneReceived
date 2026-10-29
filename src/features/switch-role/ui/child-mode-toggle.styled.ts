import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 6px rgba(26, 26, 46, 0.06)',
  },
});
