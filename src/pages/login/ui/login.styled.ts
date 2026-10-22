import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.prime,
  },
  container: {
    backgroundColor: theme.colors.prime,
    display: 'flex',
    gap: 32,
    justifyContent: 'center',
    flexGrow: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  body: {
    paddingHorizontal: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
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
  // Невидимая копия поля Full Name: держит высоту формы как в регистрации,
  // чтобы верхний блок стоял на том же уровне.
  fieldSpacer: {
    opacity: 0,
  },
  field: {
    gap: 8,
  },
});
