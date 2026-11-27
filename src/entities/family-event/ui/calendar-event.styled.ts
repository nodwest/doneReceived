import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  // Большая карточка события: фото, затемнение и текст сверху.
  card: {
    height: 205,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.childDeep,
    boxShadow: '0px 12px 24px rgba(26, 26, 46, 0.18)',
  },
  pressed: {
    opacity: 0.9,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  photoActions: {
    position: 'absolute',
    zIndex: 1,
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  photoAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8, 16, 32, 0.45)',
  },
  /** В форме над карточкой есть кнопки: текст начинается ниже, без наложения. */
  copyWithActions: {
    paddingTop: 52,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  homeCopy: { justifyContent: 'flex-end' },
  homeKicker: { fontSize: 12, textTransform: 'none', color: colors.success },
  homeSchedule: { fontSize: 13, lineHeight: 18 },
  copy: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  text: {
    gap: 4,
  },
  kicker: {
    fontSize: 9,
    letterSpacing: tracking(9),
    fontFamily: theme.fonts.extrabold,
    color: 'rgba(255, 255, 255, 0.84)',
    textTransform: 'uppercase',
  },
  title: {
    maxWidth: 300,
    fontSize: 24,
    letterSpacing: tracking(24),
    lineHeight: 25,
    fontFamily: theme.fonts.extrabold,
    color: colors.white,
  },
  description: {
    maxWidth: 300,
    fontSize: 11,
    letterSpacing: tracking(11),
    lineHeight: 15,
    fontFamily: theme.fonts.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 27,
    height: 27,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.78)',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  spacer: {
    flex: 1,
  },
  reminder: {
    flexShrink: 1,
    fontSize: 9,
    letterSpacing: tracking(9),
    fontFamily: theme.fonts.semibold,
    color: 'rgba(255, 255, 255, 0.82)',
    textAlign: 'right',
  },

  // Маленькая карточка ближайшего события.
  tile: {
    flex: 1,
    minWidth: 0,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 4px 12px rgba(26, 26, 46, 0.035)',
  },
  tileTitle: {
    fontSize: 12.5,
    letterSpacing: tracking(12.5),
    lineHeight: 14,
    fontFamily: theme.fonts.extrabold,
    color: colors.ink,
  },
  tileMeta: {
    marginTop: 3,
    fontSize: 9.5,
    letterSpacing: tracking(9.5),
    lineHeight: 13,
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  tileAvatars: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
