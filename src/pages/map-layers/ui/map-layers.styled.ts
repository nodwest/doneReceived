import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

/** Кнопки под смахнутой строкой: 50×50, между ними 8, по 12 до краёв. */
const SWIPE_ACTION_SIZE = 50;
export const SWIPE_ACTION_GAP = 8;
const SWIPE_ACTION_EDGE = 12;
/** На сколько сдвигается строка, открывая `count` кнопок. */
export const swipeActionsWidth = (count: number) =>
  count * SWIPE_ACTION_SIZE +
  (count - 1) * SWIPE_ACTION_GAP +
  2 * SWIPE_ACTION_EDGE;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.colors.prime,
  },
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    paddingBottom: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 12px rgba(26, 26, 46, 0.06)',
    overflow: 'hidden',
  },
  // Заголовок раздела капсом и счётчик справа.
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    paddingBottom: 4,
    paddingHorizontal: 14,
  },
  cardTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: theme.fontSize.xs,
    letterSpacing: 0.72,
    textTransform: 'uppercase',
    fontFamily: theme.fonts.bold,
    color: theme.colors.grey,
  },
  cardCount: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  // Список раздела: высоту ограничивает SECTION_LIST_MAX_HEIGHT, дальше скролл.
  sectionList: {
    flexGrow: 0,
  },
  rowWrap: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
  },
  row: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 14,
  },
  // Строка области: выше, слева место под полосу «кто-то внутри».
  rowTall: {
    paddingVertical: 14,
    paddingLeft: 10,
  },
  accentWrap: {
    paddingVertical: 12,
  },
  accent: {
    flex: 1,
    width: 4,
    borderRadius: 2,
  },
  accentOn: {
    backgroundColor: theme.colors.success,
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
    backgroundColor: theme.colors.line,
  },
  dividerInset: {
    marginLeft: 60,
    marginRight: 0,
  },
  pressed: {
    opacity: 0.72,
  },
  rowIcon: {
    width: 36,
    height: 36,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.mapAccentTint,
  },
  rowIconBus: {
    backgroundColor: theme.colors.busTile,
  },
  avatar: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 20,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  rowAside: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  rowSubtitle: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Ребёнок в области — «дома» тёплым коричневым, как на карточке Family.
  presenceAt: {
    flexShrink: 1,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.homeBrown,
  },
  statusInside: {
    flexShrink: 1,
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.presenceInside,
  },
  statusMuted: {
    flexShrink: 1,
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.mutedSoft,
  },
  statusAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  statusDot: {
    width: 6,
    height: 6,
    marginRight: 2,
    borderRadius: 3,
    backgroundColor: theme.colors.grey,
  },
  statusDotSoft: {
    backgroundColor: theme.colors.placeholder,
  },
  // Кто сейчас в области: фото детей, второе чуть наезжает на первое.
  who: {
    flexDirection: 'row',
  },
  whoAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  whoOverlap: {
    marginLeft: -10,
  },
  empty: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 10,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  // Пунктирная кнопка «Добавить…» внизу карточки.
  addWrap: {
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 12,
  },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: theme.colors.mapAccentBorder,
    backgroundColor: theme.colors.mapAccentSoft,
  },
  addText: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.mapAccent,
  },
  // Смахнутая область: под строкой серый фон и кнопки Edit / Delete.
  swipeBack: {
    backgroundColor: theme.colors.swipeBack,
  },
  swipeFront: {
    backgroundColor: theme.colors.white,
  },
  swipeAction: {
    width: SWIPE_ACTION_SIZE,
    height: SWIPE_ACTION_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderRadius: 16,
    boxShadow:
      '0px 1px 3px rgba(26, 26, 46, 0.1), 0px 4px 10px rgba(26, 26, 46, 0.18)',
  },
  swipeEdit: {
    backgroundColor: theme.colors.childFrom,
  },
  swipeDelete: {
    marginRight: SWIPE_ACTION_EDGE,
    backgroundColor: theme.colors.dangerAction,
  },
  swipeLabel: {
    fontSize: 10,
    letterSpacing: tracking(10),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  swipeHintText: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  sheet: {
    paddingTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  sheetTitle: {
    marginBottom: 14,
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  // Маршруты в шторке — карточкой с рамкой.
  sheetList: {
    flexShrink: 1,
    marginBottom: 16,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  sheetEmpty: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  sheetEmptyIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: theme.colors.busTile,
  },
  sheetEmptyText: {
    textAlign: 'center',
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  confirmBody: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 4,
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  confirmIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dangerIconBg,
  },
  confirmHeader: {
    alignItems: 'center',
    gap: 8,
  },
  confirmTitle: {
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  confirmSubtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  confirmActions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  confirmDelete: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: theme.colors.dangerText,
    boxShadow: '0px 4px 12px rgba(229, 72, 77, 0.22)',
  },
  confirmDeleteText: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});
