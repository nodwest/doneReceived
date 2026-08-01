import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.prime,
    display: 'flex',
    gap: 32,
    justifyContent: 'center',
    height: '100%',
  },
  header: {
    maxWidth: 320,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    margin: 24,
  },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: theme.fontSize.h1,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    color: theme.colors.grey,
  },
  buttontitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    color: theme.colors.prime,
    fontWeight: 'bold',
  },
  linktitle: {
    color: theme.colors.violet,
    fontWeight: 'bold',
  },
  label: {
    fontSize: theme.fontSize.inputName,
    color: theme.colors.grey,
  },
  content: {
    width: '100%',
    gap: 16,
  },
  field: {
    gap: 8,
  },
});
