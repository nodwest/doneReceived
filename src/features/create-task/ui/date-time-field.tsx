import { Pressable, Platform, Text, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { formatDeadline } from '../model/deadline';
import { styles } from './create-task-form.styled';

type DateTimeFieldProps = {
  value: Date;
  minimumDate: Date;
  onChange: (date: Date) => void;
};

export function DateTimeField({
  value,
  minimumDate,
  onChange,
}: DateTimeFieldProps) {
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.dateButton}>
        <DateTimePicker
          value={value}
          mode="datetime"
          display="compact"
          minimumDate={minimumDate}
          onValueChange={(_, date) => onChange(date)}
        />
      </View>
    );
  }

  // Android показывает системные диалоги: сначала дата, затем время.
  const openPicker = () =>
    DateTimePickerAndroid.open({
      value,
      mode: 'date',
      minimumDate,
      onValueChange: (_, date) =>
        DateTimePickerAndroid.open({
          value: date,
          mode: 'time',
          is24Hour: true,
          onValueChange: (__, time) => onChange(time),
        }),
    });

  return (
    <Pressable style={styles.dateButton} onPress={openPicker}>
      <Text style={styles.dateButtonText}>{formatDeadline(value)}</Text>
    </Pressable>
  );
}
