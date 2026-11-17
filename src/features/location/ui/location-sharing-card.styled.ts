import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    right: 16,
    bottom: 56,
    left: 16,
    zIndex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.14)',
  },
  icon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: theme.colors.childTint,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  dotError: {
    backgroundColor: theme.colors.reviewAccent,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
    gap: 12,
  },
  sheetTitle: {
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  sheetText: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },
  bullet: {
    flexDirection: 'row',
    gap: 8,
  },
  bulletMark: {
    width: 6,
    height: 6,
    marginTop: 7,
    borderRadius: 3,
    backgroundColor: theme.colors.childDeep,
  },
  bulletText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },
  status: {
    gap: 6,
    padding: 12,
    borderRadius: 14,
    backgroundColor: theme.colors.prime,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  statusLabel: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  statusValue: {
    flexShrink: 1,
    textAlign: 'right',
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  error: {
    fontSize: theme.fontSize.xs,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.dangerText,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowItem: {
    flex: 1,
  },
  pressed: {
    opacity: 0.8,
  },
});
