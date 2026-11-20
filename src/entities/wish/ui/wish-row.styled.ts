import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
  },
  ready: {
    borderColor: colors.readyBorder,
    backgroundColor: colors.readyBg,
  },
  // Рамка толще на 0.5 — отступы меньше на 0.5, чтобы высота не менялась.
  current: {
    paddingVertical: 11.5,
    paddingLeft: 11.5,
    paddingRight: 9.5,
    borderWidth: 1.5,
    borderColor: colors.childFrom,
    backgroundColor: colors.currentBg,
  },
  waiting: {
    borderColor: colors.queueBorder,
    backgroundColor: colors.queueBg,
  },
  // Поднятая строка, пока её перетаскивают.
  lifted: {
    boxShadow: '0px 12px 24px rgba(26, 26, 46, 0.16)',
  },
  body: {
    flex: 1,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  iconReady: {
    backgroundColor: colors.readyIconBg,
  },
  iconWaiting: {
    backgroundColor: colors.queueIconBg,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
  info: {
    flex: 1,
    gap: 8,
  },
  // Шапка, полоса и нижняя строка фиксированной высоты: карточки всех
  // статусов одинаковые.
  head: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  // Кнопка в шапке: лежит поверх строки, а не внутри нажимаемой области.
  action: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 24,
    justifyContent: 'center',
  },
  chip: {
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  readyChip: {
    backgroundColor: colors.readySoft,
  },
  currentChip: {
    backgroundColor: colors.childChip,
  },
  waitingChip: {
    backgroundColor: colors.queueSoft,
  },
  chipText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
  },
  readyText: {
    color: colors.readyText,
  },
  currentText: {
    color: colors.childInk,
  },
  waitingText: {
    color: colors.queueText,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  trackWaiting: {
    backgroundColor: colors.queueSoft,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  meta: {
    height: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  amount: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  note: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteText: {
    flexShrink: 1,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  noteWaiting: {
    color: colors.inkSoft,
  },
}));
