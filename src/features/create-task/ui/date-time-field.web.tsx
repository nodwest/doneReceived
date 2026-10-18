import { createElement } from 'react';
import { styles } from './create-task-form.styled';

type DateTimeFieldProps = {
  value: Date;
  minimumDate: Date;
  onChange: (date: Date) => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

// Формат значения для <input type="datetime-local"> в локальной зоне.
const toInputValue = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}`;

export function DateTimeField({
  value,
  minimumDate,
  onChange,
}: DateTimeFieldProps) {
  return createElement('input', {
    type: 'datetime-local',
    value: toInputValue(value),
    min: toInputValue(minimumDate),
    style: styles.dateInputWeb,
    onChange: (event: { target: { value: string } }) => {
      const date = new Date(event.target.value);
      if (!Number.isNaN(date.getTime())) onChange(date);
    },
  });
}
