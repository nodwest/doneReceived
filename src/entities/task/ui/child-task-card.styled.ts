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
  picked: {
    flexDirection: 'row',
    gap: 10,
  },
  pickedItem: {
    flex: 1,
    maxWidth: '33%',
    aspectRatio: 1,
  },
  pickedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  pickedRemove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
