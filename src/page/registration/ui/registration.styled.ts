import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme/theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.prime,
    display: 'flex',
    gap: 32,
    justifyContent: 'center',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 88,
    height: 88,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.fontSize.h1,
  },
  titleDescription: {
    fontSize: theme.fontSize.sm,
  },
  inputName: {
    fontSize: theme.fontSize.inputName,
    color: theme.colors.grey,
  },
});
