import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
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
export function TaskNoteField({
  label,
  optionalLabel,
  placeholder,
  hint,
  value,
  onChange,
}: TaskNoteFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={sheetStyles.section}>
      <View style={sheetStyles.sectionHead}>
        <SectionLabel>{label}</SectionLabel>
        <View style={styles.optional}>
          <Text style={styles.optionalText}>{optionalLabel}</Text>
        </View>
      </View>
      <View style={[styles.field, focused && styles.fieldFocused]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          maxLength={TASK_NOTE_MAX_LENGTH}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholderSoft}
          accessibilityLabel={label}
          accessibilityHint={hint}
          style={styles.input}
        />
        <Text style={styles.counter}>
          {value.length} / {TASK_NOTE_MAX_LENGTH}
        </Text>
      </View>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}
