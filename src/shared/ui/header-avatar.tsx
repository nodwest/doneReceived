import { Image, StyleSheet, type ImageSourcePropType } from 'react-native';
import { theme } from '../theme';

/** Аватар 48pt в белой обводке с тенью — в правом углу шапки экрана. */
export function HeaderAvatar({ source }: { source: ImageSourcePropType }) {
  return <Image source={source} style={styles.avatar} />;
}

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.white,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
});
