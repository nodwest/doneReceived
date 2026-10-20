import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.prime,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
    // Контента меньше, чем в регистрации: добавка поднимает иконку на тот же уровень.
    paddingBottom: 41,
  },
  header: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 16,
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
    color: theme.colors.ink,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    color: theme.colors.grey,
  },
  options: {
    gap: 16,
    // Опускает кнопку на уровень кнопок регистрации и логина.
    paddingBottom: 89,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
  },
  cardSelected: {
    borderColor: theme.colors.violet,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  cardDescription: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    color: theme.colors.grey,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: theme.colors.violet,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.violet,
  },
  button: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonTitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    color: theme.colors.prime,
    fontWeight: 'bold',
  },
});
