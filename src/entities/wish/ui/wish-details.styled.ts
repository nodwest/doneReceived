import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  root: {
    gap: 18,
  },
  noPhotos: {
    gap: 12,
    padding: 16,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 14px rgba(26, 26, 51, 0.06)',
  },
  noPhotosEmpty: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPhotosTitle: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  noPhotosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  wishTile: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  head: {
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 26,
    letterSpacing: tracking(26),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  price: {
    fontSize: 26,
    letterSpacing: tracking(26),
    fontFamily: theme.fonts.bold,
    color: theme.colors.childDeep,
  },
  priceReady: {
    color: theme.colors.readyText,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.line,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saved: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.childDeep,
  },
  savedReady: {
    color: theme.colors.readyText,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  chipText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
  },
  added: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  note: {
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.childTintBorder,
    overflow: 'hidden',
  },
  noteLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  noteLabelText: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.childDeep,
  },
  noteText: {
    fontSize: 15,
    letterSpacing: tracking(15),
    lineHeight: 21,
    fontFamily: theme.fonts.regular,
    color: theme.colors.ink,
  },
  store: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 14px rgba(26, 26, 51, 0.06)',
  },
  pressed: {
    opacity: 0.8,
  },
  storeIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(108, 92, 231, 0.12)',
  },
  storeInfo: {
    flex: 1,
    gap: 2,
  },
  storeTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  storeUrl: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
});
