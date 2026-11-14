import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  // Подпись источников при открытии карты: маленькая, но читаемая плашка.
  credit: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    zIndex: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.cardBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  creditText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },
  // Свёрнутая подпись — только «i» в углу карты.
  info: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    zIndex: 3,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.cardBorder,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  infoText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
    color: theme.colors.inkSoft,
  },
  sheet: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    marginBottom: 6,
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.line,
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  rowSubtitle: {
    fontSize: theme.fontSize.xs,
    lineHeight: 16,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  pressed: {
    opacity: 0.72,
  },
});
