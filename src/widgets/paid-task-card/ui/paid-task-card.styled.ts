import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  wish: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.childTintBorder,
    backgroundColor: theme.colors.currentBg,
  },
  wishIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wishText: {
    flex: 1,
    gap: 6,
  },
  wishHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wishTitle: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  wishNums: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.childDeep,
  },
  track: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: theme.colors.childChip,
  },
  saved: {
    height: '100%',
    backgroundColor: theme.colors.childDeep,
  },
  added: {
    height: '100%',
    backgroundColor: theme.colors.earned,
  },

  note: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(46, 184, 115, 0.35)',
    backgroundColor: theme.colors.readyBg,
  },
  noteIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.earned,
  },
  noteText: {
    flex: 1,
    gap: 2,
  },
  noteTitle: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: theme.colors.readyText,
  },
  noteCaption: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },
});
