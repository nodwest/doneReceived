import { Platform, StyleSheet, type TextStyle } from 'react-native';
import { theme, tracking } from '@shared/theme';

const FIELD_HEIGHT = 50;
const TILE = 72;

export const styles = StyleSheet.create({
  body: {
    gap: 14,
    paddingTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  close: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: theme.colors.closeBg,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.inkSoft,
  },
  input: {
    minHeight: FIELD_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.prime,
  },
  // Поле в фокусе — белое с голубой рамкой, как в макете.
  inputFocused: {
    borderWidth: 2,
    paddingHorizontal: 15,
    borderColor: theme.colors.childFrom,
    backgroundColor: theme.colors.white,
  },
  inputMultiline: {
    minHeight: 76,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  text: {
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
    ...Platform.select<TextStyle>({
      // Своя рамка фокуса у обёртки поля: браузерную убираем совсем —
      // даже прозрачная outline: auto закрашивает рамку поверх поля.
      web: { outlineStyle: 'none' } as unknown as TextStyle,
    }),
  },
  // Три строки описания видны целиком, дальше поле прокручивается.
  textMultiline: {
    alignSelf: 'auto',
    height: 66,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  currency: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.grey,
  },
  // Крестик фото выступает за край: место под него сверху и справа.
  photosScroll: {
    marginTop: -6,
    marginRight: -20,
  },
  photos: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 6,
    paddingRight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  photo: {
    width: TILE,
    height: TILE,
    borderRadius: 18,
  },
  remove: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.white,
    backgroundColor: 'rgba(26, 26, 46, 0.75)',
  },
  hint: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
  topWish: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.childTintBorder,
    overflow: 'hidden',
  },
  topWishText: {
    flex: 1,
    gap: 2,
  },
  topWishTitle: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  topWishHint: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: theme.colors.inkSoft,
  },
  button: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonLabel: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.white,
  },
  delete: {
    backgroundColor: theme.colors.dangerSoft,
  },
  deleteLabel: {
    color: theme.colors.dangerText,
  },
});
