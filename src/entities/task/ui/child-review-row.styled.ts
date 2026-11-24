import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  tile: {
    gap: 10,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.reviewBorder,
  },
  pressed: {
    opacity: 0.85,
  },
  // Теснее, чем в других плитках: чип и время по-русски входят на 360pt.
  head: {
    gap: 8,
  },
  meta: {
    gap: 4,
  },
  // Не шире места рядом с плашкой времени: на узком экране — многоточие.
  chip: {
    maxWidth: '100%',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: colors.reviewChipBg,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: colors.reviewText,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 4,
  },
  footerAside: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoChip: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: colors.reviewPillBg,
  },
  photoChipText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.semibold,
    color: colors.reviewChipText,
  },
  checking: {
    flexShrink: 1,
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: colors.grey,
  },
}));
