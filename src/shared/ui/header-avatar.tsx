import { type ImageSourcePropType } from 'react-native';
import { createStyles } from '../theme';
import { LetterAvatar } from './letter-avatar';

type HeaderAvatarProps = {
  /** Фото; null — первая буква имени. */
  source: ImageSourcePropType | null;
  name: string;
};

/** Аватар 48pt в белой обводке с тенью — в правом углу шапки экрана. */
export function HeaderAvatar({ source, name }: HeaderAvatarProps) {
  return (
    <LetterAvatar
      source={source}
      name={name}
      style={styles.avatar}
      letterSize={20}
    />
  );
}

const styles = createStyles((colors) => ({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.white,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));
