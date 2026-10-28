import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

const AVATAR_SIZE = 104;
const BADGE_SIZE = 34;

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  headerSpacer: {
    width: 44,
  },
  body: {
    flexGrow: 1,
    gap: 24,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  avatarBlock: {
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
  },
  // Значок камеры на краю фото, в белом ободке.
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 3,
    borderColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhoto: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  card: {
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 12px rgba(26, 26, 46, 0.06)',
  },
  // Прижимает Save changes к низу, когда форма короче экрана.
  footer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});
