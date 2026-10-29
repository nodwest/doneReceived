import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

// Фон активной карточки: полупрозрачный фиолетово-синий градиент.
export const ACTIVE_CARD_GRADIENT = [
  'rgba(108, 92, 231, 0.333)',
  'rgba(74, 144, 226, 0.567)',
] as const;

// Поля по бокам имени: таймер «02:14:36» шириной ~97pt не перекрывается
// даже на узком экране, где имя около 66pt.
const NAME_INSET = 92;

const block = {
  borderRadius: 18,
  backgroundColor: theme.colors.white,
} as const;

export const styles = StyleSheet.create({
  card: {
    gap: 12,
    paddingTop: 11,
    paddingBottom: 14,
    paddingHorizontal: 7,
    borderRadius: 24,
  },
  cardActive: {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  cardReview: {
    borderWidth: 1,
    borderColor: theme.colors.reviewBorder,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: theme.colors.violetSoft,
  },
  // Имя по центру карточки, независимо от ширины блоков по краям; поля по
  // бокам не дают ему заехать под аватар и таймер.
  nameWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: NAME_INSET,
    pointerEvents: 'none',
  },
  name: {
    fontSize: theme.fontSize.h1,
    letterSpacing: tracking(theme.fontSize.h1),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  nameCompact: {
    fontSize: 22,
    letterSpacing: tracking(22),
  },
  nameWithCaption: {
    fontSize: 24,
    letterSpacing: tracking(24),
  },
  nameCaption: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },
  timer: {
    height: 60,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  timerLabel: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },
  timerValue: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
    fontVariant: ['tabular-nums'],
  },

  taskBlock: {
    ...block,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  taskBlockGrow: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  // На карточке проверки блок задания занимает свободную высоту, текст по центру.
  taskBlockReview: {
    flexGrow: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.reviewBorder,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  taskText: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  description: {
    fontSize: 13,
    letterSpacing: tracking(13),
    lineHeight: 18,
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },
  meta: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },

  statusBlock: {
    ...block,
    gap: 12,
    padding: 16,
  },
  caption: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  step: {
    alignItems: 'center',
    gap: 6,
  },
  stepLabel: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  stepLabelCurrent: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  stepDotNext: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.placeholder,
    backgroundColor: theme.colors.white,
  },
  connector: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
  },
  connectorBar: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.placeholder,
  },

  // Плитки срока и повторов растягиваются на оставшуюся высоту карточки.
  details: {
    flexGrow: 1,
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    ...block,
    flex: 1,
    minHeight: 100,
    gap: 4,
    justifyContent: 'center',
    padding: 16,
  },
  tileValue: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  tileText: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },

  photo: {
    height: 174,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.reviewBorder,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoTag: {
    position: 'absolute',
    top: 9,
    left: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  photoTagText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },

  reward: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.yellow,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardValue: {
    fontSize: 36,
    letterSpacing: tracking(36),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
});
