import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { DateTimePickerSheet } from '@shared/ui';
import { ceilToMinute } from '@shared/lib';
import { useCreateTaskStore } from '../model/create-task-store';
import {
  deadlineRows,
  formatDeadline,
  isDeadlineValid,
  MIN_DEADLINE_MS,
  resolveDeadline,
} from '../model/deadline';
import { FormField } from './form-field';
import { OptionChip } from './option-chip';
import { styles } from './create-task-form.styled';

export function DeadlineField() {
  const deadline = useCreateTaskStore((state) => state.deadline);
  const selectDeadline = useCreateTaskStore((state) => state.selectDeadline);
  const setCustomDeadline = useCreateTaskStore(
    (state) => state.setCustomDeadline,
  );

  const [pickerOpen, setPickerOpen] = useState(false);

  const now = new Date();
  const minimumDate = ceilToMinute(new Date(now.getTime() + MIN_DEADLINE_MS));
  const maximumDate = new Date(
    now.getFullYear() + 1,
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
  );
  const resolved = resolveDeadline(deadline, now);
  const valid = isDeadlineValid(deadline, now);

  return (
    <FormField label="Time to complete" optional>
      {deadlineRows.map((row) => (
        <View key={row[0].key} style={styles.chips}>
          {row.map(({ key, label }) => (
            <OptionChip
              key={key}
              label={label}
              selected={deadline.preset === key}
              onPress={() => {
                selectDeadline(key);
                if (key === 'custom') setPickerOpen(true);
              }}
            />
          ))}
        </View>
      ))}
      {resolved && (
        <View style={styles.deadlineRow}>
          <Text style={styles.deadlineHint}>Task expires:</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change deadline"
            onPress={() => setPickerOpen(true)}
            style={[styles.dateButton, !valid && styles.dateButtonInvalid]}
          >
            <Text
              style={[styles.dateButtonText, !valid && styles.deadlineError]}
            >
              {formatDeadline(resolved, now)}
            </Text>
          </Pressable>
        </View>
      )}
      {resolved && !valid && (
        <Text style={[styles.deadlineHint, styles.deadlineError]}>
          Pick a time at least 1 minute from now
        </Text>
      )}
      {resolved && (
        <DateTimePickerSheet
          visible={pickerOpen}
          value={resolved}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onCancel={() => setPickerOpen(false)}
          onConfirm={(date) => {
            setCustomDeadline(date);
            setPickerOpen(false);
          }}
        />
      )}
    </FormField>
  );
}
