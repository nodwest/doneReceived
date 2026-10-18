import { Text, View } from 'react-native';
import { useCreateTaskStore } from '../model/create-task-store';
import {
  deadlineRows,
  formatDeadline,
  isDeadlineValid,
  MIN_DEADLINE_MS,
  resolveDeadline,
} from '../model/deadline';
import { DateTimeField } from './date-time-field';
import { FormField } from './form-field';
import { OptionChip } from './option-chip';
import { styles } from './create-task-form.styled';

export function DeadlineField() {
  const deadline = useCreateTaskStore((state) => state.deadline);
  const selectDeadline = useCreateTaskStore((state) => state.selectDeadline);
  const setCustomDeadline = useCreateTaskStore(
    (state) => state.setCustomDeadline,
  );

  const now = new Date();
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
              onPress={() => selectDeadline(key)}
            />
          ))}
        </View>
      ))}
      {deadline.preset === 'custom' && resolved && (
        <DateTimeField
          value={resolved}
          minimumDate={new Date(now.getTime() + MIN_DEADLINE_MS)}
          onChange={setCustomDeadline}
        />
      )}
      {resolved && (
        <Text style={[styles.deadlineHint, !valid && styles.deadlineError]}>
          {valid
            ? `Task expires: ${formatDeadline(resolved, now)}`
            : 'Pick a time at least 1 minute from now'}
        </Text>
      )}
    </FormField>
  );
}
