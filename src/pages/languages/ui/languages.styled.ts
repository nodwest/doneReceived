import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  body: {
    flexGrow: 1,
    gap: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  // Ребёнок не учит: сверху состояние, ниже на всю высоту — список слов.
  deckScreen: {
    flex: 1,
    gap: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.childTint,
  },
  headerIconParent: {
    backgroundColor: colors.violetSoft,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  hint: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  loading: {
    paddingVertical: 48,
  },
  // Карточка ребёнка у родителя.
  childCard: {
    gap: 16,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 4px 12px rgba(23, 33, 94, 0.06)',
  },
  childCardReview: {
    borderColor: colors.reviewBorder,
  },
  childCardDone: {
    borderColor: colors.approvedBorder,
  },
  // Цветная плашка: что со словами сегодня.
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.detailsBg,
  },
  bannerLearning: {
    borderColor: colors.childTintBorder,
    backgroundColor: colors.childTintLight,
  },
  bannerReview: {
    borderColor: colors.reviewBorder,
    backgroundColor: colors.noteReviewBg,
  },
  bannerDone: {
    borderColor: colors.approvedBorder,
    backgroundColor: colors.readyBg,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violetSoft,
  },
  bannerIconLearning: {
    backgroundColor: colors.childTint,
  },
  bannerIconReview: {
    backgroundColor: colors.reviewChip,
  },
  bannerIconDone: {
    backgroundColor: colors.readySoft,
  },
  bannerText: {
    flex: 1,
    gap: 3,
  },
  bannerTitle: {
    fontSize: theme.fontSize.lg,
    lineHeight: 22,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  bannerBody: {
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  // Итоги: дней подряд, всего дней, заработано.
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: colors.givenTile,
    // Плитка чуть вдавлена в карточку — как в карточке задания.
    boxShadow: 'inset 1.5px 1.5px 2.5px rgba(51, 61, 82, 0.2)',
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    lineHeight: 26,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },
  childHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  childHeadText: {
    flex: 1,
    gap: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  childName: {
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  childStatus: {
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  words: {
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: colors.violetChip,
  },
  chipDone: {
    backgroundColor: colors.readySoft,
  },
  chipReview: {
    backgroundColor: colors.reviewChip,
  },
  chipTextDone: {
    color: colors.readyText,
  },
  chipTextReview: {
    color: colors.reviewChipText,
  },
  chipText: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.semibold,
    color: colors.parentInk,
  },
  smallLabel: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
    textTransform: 'uppercase',
  },
  note: {
    fontSize: theme.fontSize.xs,
    lineHeight: 17,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
    textAlign: 'center',
  },
  actions: {
    gap: 8,
  },
  empty: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
    paddingVertical: 32,
  },
  checkScreen: {
    flex: 1,
    paddingTop: 8,
  },
}));
