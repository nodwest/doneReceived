import { withAlpha } from '@shared/lib';
import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  // Подпись источников и «i» в ряд у левого нижнего угла карты.
  bar: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  credit: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: withAlpha(colors.surface, 0.9),
  },
  creditText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  info: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: withAlpha(colors.surface, 0.9),
  },
  infoText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
    color: colors.grey,
  },
  sheet: {
    paddingTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  title: {
    marginBottom: 12,
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  // Источники одной карточкой с рамкой, как слои в шторке «Слои карты».
  group: {
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 14,
  },
  divider: {
    height: 1,
    marginLeft: 60,
    backgroundColor: colors.line,
  },
  iconTile: {
    width: 36,
    height: 36,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.mapAccentTint,
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  rowSubtitle: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  pressed: {
    opacity: 0.72,
  },
}));
