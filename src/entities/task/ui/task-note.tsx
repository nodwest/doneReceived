import { useLayoutEffect, useRef, useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useKeepInViewContext } from '@shared/lib';
import { theme } from '@shared/theme';
import { TASK_NOTE_MAX_LENGTH } from '../model';
import { SectionLabel } from './task-sheet';
import { styles as sheetStyles } from './task-sheet.styled';
import { styles } from './task-note.styled';

type TaskNoteProps = {
  label: string;
  note: string;
  /** Оранжевый — на проверке, зелёный — в выплаченном задании. */
  tone: 'review' | 'paid';
};

/**
 * Комментарий ребёнка к сдаче: «Emma's comment» у родителя, «Your comment»
 * у ребёнка — пузырём, только для чтения.
 */
export function TaskNote({ label, note, tone }: TaskNoteProps) {
  return (
    <View style={sheetStyles.section}>
      <SectionLabel>{label}</SectionLabel>
      <View
        style={[
          styles.bubble,
          tone === 'review' ? styles.bubbleReview : styles.bubblePaid,
        ]}
      >
        <Text style={styles.text}>{note}</Text>
      </View>
    </View>
  );
}

type TaskNoteFieldProps = {
  label: string;
  /** Плашка «optional» у заголовка. */
  optionalLabel: string;
  placeholder: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
};

/**
 * Поле комментария в активной карточке ребёнка: что не получилось и почему.
 * Уходит родителю вместе с I did it!; счётчик — до `TASK_NOTE_MAX_LENGTH`.
 */
/** Поле растёт по тексту до 30% высоты экрана, дальше прокручивается. */
const MAX_HEIGHT_RATIO = 0.3;
const MIN_INPUT_HEIGHT = 44;
/**
 * Неразрывный отступ перед счётчиком в зеркале: ширина паддингов плашки и
 * зазора до текста (около 22pt при шрифте счётчика).
 */
const COUNTER_ROOM = '\u00A0'.repeat(8);

export function TaskNoteField({
  label,
  optionalLabel,
  placeholder,
  hint,
  value,
  onChange,
}: TaskNoteFieldProps) {
  const inputRef = useRef<TextInput>(null);
  const screenHeight = useWindowDimensions().height;
  // Высоту текста меряем невидимым зеркальным Text с тем же шрифтом и
  // шириной (как описание в форме задания): onContentSizeChange у
  // TextInput не умеет уменьшаться, а на вебе textarea сама не растёт.
  const [contentHeight, setContentHeight] = useState(0);
  const counter = `${value.length}\u00A0/\u00A0${TASK_NOTE_MAX_LENGTH}`;
  const maxHeight = screenHeight * MAX_HEIGHT_RATIO;
  const height = Math.min(Math.max(contentHeight, MIN_INPUT_HEIGHT), maxHeight);

  // Поле выросло — подсказка под ним не уходит под кнопки карточки: карточка
  // докручивает до отрисовки, текст над полем сдвигается вверх.
  const keepInView = useKeepInViewContext();
  const hintRef = useRef<View>(null);
  const prevHeight = useRef(height);
  useLayoutEffect(() => {
    const grew = height > prevHeight.current;
    prevHeight.current = height;
    if (grew && hintRef.current) keepInView?.(hintRef.current);
  }, [height, keepInView]);

  return (
    <View style={sheetStyles.section}>
      <View style={sheetStyles.sectionHead}>
        <SectionLabel>{label}</SectionLabel>
        <View style={styles.optional}>
          <Text style={styles.optionalText}>{optionalLabel}</Text>
        </View>
      </View>
      {/* Тап в любом месте поля, и по счётчику тоже, ставит каретку в текст.
          В фокусе поле не подсвечивается: видна только каретка. */}
      <Pressable
        accessible={false}
        onPress={() => inputRef.current?.focus()}
        style={styles.field}
      >
        <View>
          {/* Зеркало: текст (пустое поле — подсказка) и в конце неразрывный
              «хвост» шириной с плашку счётчика. Пока хвост помещается в
              последнюю строку, текст печатается рядом с плашкой; не
              поместился — переносится, поле получает строку, и плашка
              встаёт на неё. Как в мессенджерах. */}
          <Text
            aria-hidden
            style={[styles.input, styles.mirror, { pointerEvents: 'none' }]}
            onLayout={(event) =>
              setContentHeight(Math.ceil(event.nativeEvent.layout.height))
            }
          >
            {value || placeholder}{' '}
            <Text style={styles.counterText}>
              {COUNTER_ROOM}
              {counter}
            </Text>
          </Text>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChange}
            multiline
            scrollEnabled={contentHeight > maxHeight}
            maxLength={TASK_NOTE_MAX_LENGTH}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.placeholderSoft}
            accessibilityLabel={label}
            accessibilityHint={hint}
            style={[styles.input, { height }]}
          />
        </View>
        {/* Плашка в правом нижнем углу, поверх последней строки. */}
        <View style={[styles.counter, { pointerEvents: 'none' }]}>
          <Text style={styles.counterText}>{counter}</Text>
        </View>
      </Pressable>
      <Text ref={hintRef} style={styles.hint}>
        {hint}
      </Text>
    </View>
  );
}
