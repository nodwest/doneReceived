import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Label } from '@shared/ui';
import { styles } from './create-task-form.styled';

type FormFieldProps = {
  label: string;
  optional?: boolean;
  children: ReactNode;
};

export function FormField({ label, optional, children }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Label style={styles.label}>{label}</Label>
        {optional && <Text style={styles.optional}>(optional)</Text>}
      </View>
      {children}
    </View>
  );
}
