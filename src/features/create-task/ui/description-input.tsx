import { useState } from 'react';
import { Text, TextInput, useWindowDimensions, View } from 'react-native';
import { theme } from '@shared/theme';
import { styles } from './create-task-form.styled';

const MAX_HEIGHT_RATIO = 0.3;
const MIN_INPUT_HEIGHT = 56;
const BOX_VERTICAL_PADDING = 32;

type DescriptionInputProps = {
  value: string;
  onChangeText: (value: string) => void;
};

/**
 * Многострочное поле: растёт и уменьшается по тексту до 30% высоты экрана,
 * затем включается скролл. Высоту текста меряем невидимым зеркальным Text
 * с теми же шрифтом и шириной: onContentSizeChange у TextInput не умеет
 * уменьшаться, если высота задана явно (особенно в вебе).
 */
export function DescriptionInput({
  value,
  onChangeText,
}: DescriptionInputProps) {
  const screenHeight = useWindowDimensions().height;
  const [contentHeight, setContentHeight] = useState(0);

  const maxHeight = screenHeight * MAX_HEIGHT_RATIO - BOX_VERTICAL_PADDING;
  const height = Math.min(Math.max(contentHeight, MIN_INPUT_HEIGHT), maxHeight);

  return (
    <View style={styles.textareaBox}>
      <Text
        aria-hidden
        style={[
          styles.textareaInput,
          styles.textareaMirror,
          { pointerEvents: 'none' },
        ]}
        onLayout={(event) =>
          setContentHeight(Math.ceil(event.nativeEvent.layout.height))
        }
      >
        {/* Пробел в конце учитывает пустую последнюю строку после Enter. */}
        {`${value} `}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Make the bed, put toys away, and vacuum the floor."
        placeholderTextColor={theme.colors.placeholder}
        multiline
        scrollEnabled={contentHeight > maxHeight}
        style={[styles.textareaInput, { height }]}
      />
    </View>
  );
}
