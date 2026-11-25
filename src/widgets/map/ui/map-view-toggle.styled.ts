import { createStyles, theme, tracking } from '@shared/theme';

/** Капсула переключателя 2D / 3D — того же размера, что круглая кнопка слоёв. */
export const styles = createStyles((colors) => ({
  wrap: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 4,
    borderRadius: 22,
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  segment: {
    minWidth: 42,
    height: 36,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  segmentActive: {
    backgroundColor: colors.mapAccent,
  },
  label: {
    fontSize: 14,
    letterSpacing: tracking(14),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  labelActive: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.7,
  },
}));
