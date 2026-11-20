import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 8,
  },

  // Строка «чей список». Снизу 6 + 12 отступа списка — те же 18, что сверху.
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 18,
    paddingBottom: 6,
  },
  // Без переключателя: заголовок по центру шапки. Снизу 6 + 12 отступа
  // списка — те же 18, что под строкой владельца у ребёнка.
  ownerInline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  containerInline: {
    paddingBottom: 6,
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  ownerName: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },

  segments: {
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
    flexShrink: 1,
    padding: 4,
    borderRadius: 22,
  },
  // Внутренняя строка без padding: по ней измеряются сегменты, и в ней же
  // едет плашка — координаты onLayout и absolute совпадают.
  segmentTrack: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Едущая плашка выбранного сегмента: положение и ширина — из Reanimated.
  indicator: {
    position: 'absolute',
    left: 0,
    borderRadius: 18,
    overflow: 'hidden',
    pointerEvents: 'none',
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.18)',
  },
  segment: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },
  segmentWithBadge: {
    paddingRight: 8,
  },
  segmentCompact: {
    paddingHorizontal: 9,
  },
  segmentLabel: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  segmentLabelCompact: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
  },
  segmentLabelBold: {
    fontFamily: theme.fonts.bold,
  },
  segmentLabelSizer: {
    opacity: 0,
  },
  segmentLabelOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    lineHeight: 20,
    fontFamily: theme.fonts.bold,
    color: colors.white,
  },
}));
