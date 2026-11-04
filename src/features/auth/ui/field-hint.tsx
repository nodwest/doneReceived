import { Text, View } from 'react-native';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './field-hint.styled';

/**
 * hint — что нужно (синяя), met — выполнено (зелёная с галочкой),
 * error — ошибка (красная).
 */
export type HintTone = 'hint' | 'met' | 'error';

type FieldHintProps = {
  text: string;
  tone: HintTone;
};

/** Строка подсказки под полем формы: точка или галочка и текст. */
export function FieldHint({ text, tone }: FieldHintProps) {
  return (
    <View style={styles.row}>
      <View style={styles.mark}>
        {tone === 'met' ? (
          <Icon name="check" size={14} color={theme.colors.readyText} />
        ) : (
          <View style={[styles.dot, tone === 'error' && styles.dotError]} />
        )}
      </View>
      <Text style={[styles.text, styles[tone]]}>{text}</Text>
    </View>
  );
}
