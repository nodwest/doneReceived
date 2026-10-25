import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
  },
  segment: {
    flex: 1,
    minWidth: 0,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  segmentActive: {
    boxShadow: '0px 4px 10px rgba(108, 92, 231, 0.3)',
  },
  label: {
    flexShrink: 1,
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  labelActive: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  // Аватары всех детей внахлёст в белой обводке.
  stack: {
    flexDirection: 'row',
  },
  stacked: {
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  overlap: {
    marginLeft: -9,
  },
});
