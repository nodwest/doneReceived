import { useState } from 'react';
import { usePrivateReadScope } from '../api';
import { ApiImage } from './api-image';
import {
  Text,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
import { createStyles, theme, tracking } from '../theme';

type LetterAvatarProps = {
  /** Фото; null — фото нет, рисуем первую букву имени. */
  source: ImageSourcePropType | null | undefined;
  name: string;
  /** Размер и скругление — от места, где стоит аватар. */
  style: StyleProp<ImageStyle>;
  /** Размер буквы: у крупных аватаров крупнее. */
  letterSize?: number;
  /** blue — для календаря, где фиолетовый заменён синим. */
  tone?: 'violet' | 'blue' | 'onDark';
};

/** Фото человека, без фото — первая буква имени на фиолетовом. */
export function LetterAvatar(props: LetterAvatarProps) {
  const scope = usePrivateReadScope();
  const { source } = props;
  const uri = Array.isArray(source)
    ? source.map((image) => image.uri)
    : typeof source === 'object'
      ? source?.uri
      : source;
  return <Avatar key={JSON.stringify([scope, uri])} {...props} />;
}

function Avatar({
  source,
  name,
  style,
  letterSize = theme.fontSize.sm,
  tone = 'violet',
}: LetterAvatarProps) {
  const [loaded, setLoaded] = useState(false);
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
      {!loaded && (
        <Text
          style={[
            styles.letter,
            blue && styles.letterBlue,
            onDark && styles.letterOnDark,
            { fontSize: letterSize, letterSpacing: tracking(letterSize) },
          ]}
        >
          {name.trim().charAt(0).toUpperCase() || '?'}
        </Text>
      )}
      {source && (
        <ApiImage
          source={source}
          style={styles.photo}
          onImageLoad={() => setLoaded(true)}
        />
      )}
    </View>
  );
}

const styles = createStyles((colors) => ({
  initial: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violetSoft,
  },
  photo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  initialBlue: {
    backgroundColor: colors.childTint,
  },
  initialOnDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  letter: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: colors.violetInk,
  },
  letterBlue: {
    color: colors.childInk,
  },
  letterOnDark: {
    color: colors.childInk,
  },
}));
