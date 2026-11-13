import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  // Плашка «вернули на переделку»: коралловая, без тревожного красного.
  rejection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.sentBackBorder,
    backgroundColor: theme.colors.sentBackBg,
  },
  rejectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
  rejectionText: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 8,
  },
  rejectionTitle: {
    alignSelf: 'stretch',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.sentBack,
  },
  rejectionChip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.sentBackChip,
  },
  rejectionChipText: {
    fontSize: 12,
    letterSpacing: tracking(12),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.sentBackChipText,
  },
  rejectionComment: {
    alignSelf: 'stretch',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: theme.colors.ink,
  },
  optional: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 6,
    backgroundColor: theme.colors.line,
  },
  optionalText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.grey,
  },
  drop: {
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(74, 158, 240, 0.45)',
    backgroundColor: theme.colors.dropZone,
  },
  sources: {
    flexDirection: 'row',
    gap: 10,
  },
  source: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
  },
  camera: {
    backgroundColor: theme.colors.childChip,
  },
  gallery: {
    borderWidth: 1,
    borderColor: theme.colors.galleryBorder,
    backgroundColor: theme.colors.white,
  },
  pressed: {
    opacity: 0.8,
  },
  sourceLabel: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: theme.colors.childDeep,
  },
  hint: {
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
    lineHeight: 15,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});
