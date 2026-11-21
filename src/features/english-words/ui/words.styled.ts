import { Platform, type TextStyle, type ViewStyle } from 'react-native';
import { createStyles, theme, tracking } from '@shared/theme';

// В вебе у поля своя обводка в фокусе — убираем, рамка поля и так видна.
// Фон под карточкой слова: в вебе размыт, на телефоне — плотное затемнение
// (размытия в React Native без нативного модуля нет).
const viewerBackdrop = Platform.select<ViewStyle>({
  web: {
    backgroundColor: 'rgba(10, 14, 30, 0.55)',
    backdropFilter: 'blur(32px)',
  } as unknown as ViewStyle,
  default: { backgroundColor: 'rgba(10, 14, 30, 0.88)' },
});

const noWebOutline = Platform.select<TextStyle>({
  web: { outlineWidth: 0, outlineStyle: 'none' } as unknown as TextStyle,
  default: {},
});

export const styles = createStyles((colors) => ({
  // Полоса прогресса: сколько слов выучено или запомнено.
  progress: {
    gap: 8,
  },
  progressHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  progressLabel: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  progressValue: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: colors.childInk,
  },
  progressValueParent: {
    color: colors.parentInk,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: colors.line,
  },
  fill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.childFrom,
  },
  fillParent: {
    backgroundColor: colors.parentTo,
  },

  // Учёба ребёнка.
  study: {
    gap: 16,
  },
  hint: {
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
    lineHeight: 17,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  sentBack: {
    gap: 4,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.sentBackBorder,
    backgroundColor: colors.sentBackBg,
  },
  sentBackTitle: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: colors.sentBack,
  },
  sentBackText: {
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },

  // Карточка состояния: иконка, заголовок, текст и кнопки.
  state: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  stateIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.childTint,
  },
  stateIconSuccess: {
    backgroundColor: colors.earnedSoft,
  },
  stateIconReview: {
    backgroundColor: colors.reviewChip,
  },
  stateIconParent: {
    backgroundColor: colors.violetSoft,
  },
  stateIconDanger: {
    backgroundColor: colors.dangerSoft,
  },
  stateTitle: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  stateText: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    lineHeight: 21,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  // Состояние строкой — над списком всех слов, чтобы список было видно.
  stateCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.childTintBorder,
    backgroundColor: colors.childTintLight,
  },
  stateCompactSuccess: {
    borderColor: colors.approvedBorder,
    backgroundColor: colors.readyBg,
  },
  stateCompactReview: {
    borderColor: colors.reviewBorder,
    backgroundColor: colors.noteReviewBg,
  },
  stateCompactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.childTint,
  },
  stateCompactText: {
    flex: 1,
    gap: 2,
  },
  stateCompactTitle: {
    fontSize: theme.fontSize.lg,
    lineHeight: 22,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  stateCompactBody: {
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  stateActions: {
    alignSelf: 'stretch',
    gap: 10,
    marginTop: 10,
  },

  // Как устроены слова (ребёнку при первом входе).
  steps: {
    alignSelf: 'stretch',
    gap: 12,
    marginTop: 6,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.childTint,
  },
  stepNumberText: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.bold,
    color: colors.childInk,
  },
  stepText: {
    flex: 1,
    paddingTop: 3,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },

  // Награда за день (родителю при первом входе и по карандашу).
  amountField: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  amountPrefix: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  amountInput: {
    flex: 1,
    height: 52,
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
    ...noWebOutline,
  },
  // Подпись «в день» не сжимается и не переносится: сжимается поле ввода.
  amountSuffix: {
    flexShrink: 0,
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },

  // Список слов (повторение, ошибки проверки).
  list: {
    gap: 8,
  },
  listTitle: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  listHint: {
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  wordRowMissed: {
    borderColor: colors.dangerSoft,
    backgroundColor: colors.dangerTint,
  },
  wordRowRank: {
    minWidth: 40,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },
  wordRowText: {
    flex: 1,
    gap: 2,
  },
  wordRowWord: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  wordRowTranslation: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  // Все слова: строки одной высоты — список виртуальный.
  deckList: {
    flex: 1,
    marginHorizontal: -4,
  },
  deckListBody: {
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  deckItem: {
    height: 68,
    paddingBottom: 8,
  },
  deckRow: {
    flex: 1,
    paddingVertical: 0,
  },
  // Сегодняшние слова: голубая подложка и рамка, номер — синим.
  deckRowToday: {
    borderColor: colors.childTintBorder,
    backgroundColor: colors.childTint,
  },
  deckRowTodayRank: {
    color: colors.childInk,
  },
  deckRowSelected: {
    borderWidth: 1.5,
    borderColor: colors.childFrom,
  },
  // Нажимаемая часть строки — во всю высоту, до динамика.
  deckRowPress: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deckRowPressed: {
    opacity: 0.7,
  },

  // Карточка слова поверх списка.
  viewer: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 16,
  },
  viewerBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...viewerBackdrop,
  },
  viewerBackdropPress: {
    flex: 1,
  },
  // Лента шире экрана, по центру: средняя страница — ровно экран.
  viewerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerPage: {
    alignItems: 'center',
  },
  viewerHint: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  viewerHintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewerHintText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },

  // Проверка родителем.
  check: {
    flex: 1,
    gap: 16,
  },
  checkHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkTitleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  checkTitle: {
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  checkSubtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.line,
  },
  dotCurrent: {
    backgroundColor: colors.parentTo,
  },
  dotRight: {
    backgroundColor: colors.earned,
  },
  // Ошибка — спокойным серым, не красным.
  dotWrong: {
    backgroundColor: colors.grey,
  },
  askHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.violetSoft,
  },
  askHintText: {
    flex: 1,
    fontSize: theme.fontSize.inputName,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: colors.parentInk,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.childChip,
  },
  badgeReview: {
    backgroundColor: colors.reviewChip,
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: colors.childInk,
  },
  badgeTextReview: {
    color: colors.reviewChipText,
  },
  scrollBody: {
    gap: 16,
    paddingBottom: 24,
  },
  link: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  linkText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.parentInk,
  },
}));
