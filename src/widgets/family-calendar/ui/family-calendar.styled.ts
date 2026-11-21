import { createStyles, theme, tracking } from '@shared/theme';

export const DAY_GAP = 4;

export const styles = createStyles((colors) => ({
  card: {
    padding: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 6px 18px rgba(26, 26, 46, 0.045)',
  },
  header: {
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.childTint,
  },
  month: {
    flexShrink: 1,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  toggle: {
    height: 27,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.childTint,
  },
  toggleText: {
    fontSize: 9.5,
    letterSpacing: tracking(9.5),
    fontFamily: theme.fonts.extrabold,
    color: colors.childInk,
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },

  weekList: {
    height: 62,
    marginTop: 12,
    flexGrow: 0,
  },
  weekContent: {
    gap: DAY_GAP,
  },
  day: {
    height: 62,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayToday: {
    borderColor: 'transparent',
    backgroundColor: colors.blue,
    boxShadow: '0px 7px 16px rgba(74, 144, 226, 0.32)',
  },
  daySelected: {
    backgroundColor: colors.yellow,
    borderColor: colors.yellow,
  },
  daySelectedText: {
    color: '#241b0e',
  },
  dotSelected: {
    backgroundColor: '#241b0e',
  },
  dayWeekday: {
    fontSize: 8,
    letterSpacing: tracking(8),
    fontFamily: theme.fonts.bold,
    color: colors.grey,
    textTransform: 'uppercase',
  },
  dayWeekdayToday: {
    color: 'rgba(255, 255, 255, 0.84)',
  },
  dayNumber: {
    fontSize: 16,
    letterSpacing: tracking(16),
    lineHeight: 17,
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  dayNumberToday: {
    color: colors.white,
  },
  dot: {
    position: 'absolute',
    bottom: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.yellow,
  },
  dotBlue: {
    backgroundColor: colors.blue,
  },
  dotToday: {
    backgroundColor: colors.surface,
  },
  weekCaption: {
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  weekCaptionToday: {
    fontSize: 9.5,
    letterSpacing: tracking(9.5),
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  weekCaptionHint: {
    fontSize: 9,
    letterSpacing: tracking(9),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },

  weekdays: {
    marginTop: 8,
    flexDirection: 'row',
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 7.5,
    letterSpacing: tracking(7.5),
    fontFamily: theme.fonts.bold,
    color: colors.grey,
    textTransform: 'uppercase',
  },
  monthGrid: {
    marginTop: 4,
  },
  monthRow: {
    flexDirection: 'row',
  },
  monthDay: {
    flex: 1,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthDayToday: {
    backgroundColor: colors.blue,
  },
  monthDayRange: {
    backgroundColor: colors.childTint,
  },
  monthNumber: {
    fontSize: 10.5,
    letterSpacing: tracking(10.5),
    fontFamily: theme.fonts.semibold,
    color: colors.inkSoft,
  },
  monthNumberOutside: {
    color: colors.placeholder,
    fontFamily: theme.fonts.medium,
  },
  monthNumberToday: {
    color: colors.white,
    fontFamily: theme.fonts.extrabold,
  },
  monthNumberRange: {
    color: colors.childInk,
  },
  monthDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.yellow,
  },
  monthDotBlue: {
    backgroundColor: colors.blue,
  },
  monthDotToday: {
    backgroundColor: colors.surface,
  },
}));
