import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
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
