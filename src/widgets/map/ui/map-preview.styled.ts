import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

const PIN_SIZE = 44;
const PHOTO_SIZE = 36;

export const styles = StyleSheet.create({
  // Не выше четверти экрана телефона (812pt).
  card: {
    height: 180,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.mapPlaceholder,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  // Точка на карте — центр превью.
  pin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: PIN_SIZE,
    height: PIN_SIZE,
    marginTop: -PIN_SIZE / 2,
    marginLeft: -PIN_SIZE / 2,
    borderRadius: PIN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    pointerEvents: 'none',
  },
  pinPhoto: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2,
  },
  place: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    pointerEvents: 'none',
  },
  placeName: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  placeTime: {
    fontSize: theme.fontSize.xs,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});
