import { createStyles, theme, tracking } from '@shared/theme';

// Подписи-заголовки секций капсом: «WHAT TO DO», «PHOTO REPORT».
const CAPS_TRACKING = 0.66;

export const styles = createStyles((colors) => ({
  card: {
    flex: 1,
    minHeight: 0,
    borderRadius: 32,
    backgroundColor: colors.cardBase,
    overflow: 'hidden',
  },
  // Тень со всех сторон: карточка не сливается с фоном экрана.
  shadowSheet: {
    boxShadow: '0px 0px 24px 2px rgba(26, 26, 46, 0.28)',
  },
  shadowReview: {
    boxShadow: '0px 10px 28px rgba(230, 126, 0, 0.12)',
  },
  shadowWallet: {
    boxShadow: '0px 10px 28px rgba(23, 33, 96, 0.14)',
  },

  hero: {
    gap: 18,
    padding: 20,
  },
  from: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  who: {
    flex: 1,
    gap: 1,
  },
  caption: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  captionDark: {
    color: colors.heroReviewCaption,
  },
  name: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.white,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: tracking(30),
    fontFamily: theme.fonts.extrabold,
    color: colors.white,
  },
  titleAmount: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: tracking(36),
    fontVariant: ['tabular-nums'],
  },
  textDark: {
    color: colors.ink,
  },
  // Белое название на оранжевой шапке «на проверке»: тень держит контраст.
  titleOnWarm: {
    textShadowColor: 'rgba(140, 77, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  pill: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  pillLight: {
    gap: 8,
    paddingLeft: 12,
    backgroundColor: colors.reviewPillBg,
  },
  pillText: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.white,
    fontVariant: ['tabular-nums'],
  },
  pillTextReview: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    color: colors.reviewChipText,
  },
  dotRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 185, 48, 0.35)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.reviewDot,
  },

  bodyWrap: {
    flex: 1,
    minHeight: 0,
  },
  body: {
    gap: 20,
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  // Кнопки в теле: тело не ниже карточки, кнопки прижаты к его низу.
  bodyWithFooter: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  bodyFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
  },
  // Текст уходит под кнопки не обрываясь, а растворяясь.
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 28,
    pointerEvents: 'none',
  },
  // То же растворение под шапкой: текст уходит под неё.
  fadeTop: {
    top: 0,
    bottom: undefined,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  sectionLabel: {
    fontSize: 11,
    letterSpacing: CAPS_TRACKING,
    textTransform: 'uppercase',
    fontFamily: theme.fonts.bold,
    color: colors.grey,
  },
  section: {
    gap: 10,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionAside: {
    marginLeft: 'auto',
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },

  brief: {
    gap: 7,
  },
  briefHead: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    fontSize: theme.fontSize.md,
    lineHeight: 25,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.regular,
    color: colors.ink,
  },

  rewardChip: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.rewardChipBorder,
    overflow: 'hidden',
  },
  rewardChipPaid: {
    borderColor: colors.readyBorder,
    backgroundColor: colors.readySoft,
  },
  rewardChipValuePaid: {
    color: colors.readyText,
  },
  rewardChipMissed: {
    borderColor: colors.missedBorder,
    backgroundColor: colors.missedTile,
  },
  rewardChipValueMissed: {
    color: colors.missedDeep,
  },
  rewardChipValue: {
    fontSize: 18,
    letterSpacing: tracking(18),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },

  tiles: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    // Плитка чуть вдавлена в карточку.
    boxShadow: 'inset 1.5px 1.5px 2.5px rgba(51, 61, 82, 0.2)',
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  tileText: {
    flex: 1,
    gap: 1,
  },
  tileLabel: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },
  tileValue: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },

  photoHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));
