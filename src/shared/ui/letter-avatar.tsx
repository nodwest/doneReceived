import { ApiImage } from './api-image';
import {
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
import { theme, tracking } from '../theme';

type LetterAvatarProps = {
  /** Фото; null — фото нет, рисуем первую букву имени. */
  source: ImageSourcePropType | null;
  name: string;
  /** Размер и скругление — от места, где стоит аватар. */
  style: StyleProp<ImageStyle>;
  /** Размер буквы: у крупных аватаров крупнее. */
  letterSize?: number;
  /** blue — для календаря, где фиолетовый заменён синим. */
  tone?: 'violet' | 'blue' | 'onDark';
};

/** Фото человека, без фото — первая буква имени на фиолетовом. */
export function LetterAvatar({
  source,
  name,
  style,
  letterSize = theme.fontSize.sm,
  tone = 'violet',
}: LetterAvatarProps) {
  if (source) return <ApiImage source={source} style={style} />;
  const blue = tone === 'blue';
  const onDark = tone === 'onDark';
  return (
    <View
      style={[
        style,
        styles.initial,
        blue && styles.initialBlue,
        onDark && styles.initialOnDark,
      ]}
    >
      <Text
        style={[
          styles.letter,
          blue && styles.letterBlue,
          onDark && styles.letterOnDark,
          { fontSize: letterSize, letterSpacing: tracking(letterSize) },
        ]}
      >
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  initial: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.violetSoft,
  },
  initialBlue: {
    backgroundColor: theme.colors.childTint,
  },
  initialOnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  letter: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
  letterBlue: {
    color: theme.colors.childDeep,
  },
  letterOnDark: {
    color: theme.colors.childDeep,
  },
});
