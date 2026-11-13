import { ApiImage } from '@shared/ui';
import {
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
import { theme, tracking } from '@shared/theme';

type AssigneeAvatarProps = {
  /** Фото; null — у ребёнка с сервера фото пока нет. */
  source: ImageSourcePropType | null;
  name: string;
  /** Размер и скругление — от места, где стоит аватар. */
  style: StyleProp<ImageStyle>;
};

/** Фото ребёнка или родителя, без фото — первая буква имени на фиолетовом. */
export function AssigneeAvatar({ source, name, style }: AssigneeAvatarProps) {
  if (source) return <ApiImage source={source} style={style} />;
  return (
    <View style={[style, styles.initial]}>
      <Text style={styles.letter}>{name.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  initial: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.violetSoft,
  },
  letter: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: theme.colors.violet,
  },
});
