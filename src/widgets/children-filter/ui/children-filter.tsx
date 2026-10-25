import type { ReactNode } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { styles } from './children-filter.styled';

type FilterChild = {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
};

/** 'all' — все дети, иначе id ребёнка. */
export type ChildFilterValue = 'all' | number;

type ChildrenFilterProps = {
  items: FilterChild[];
  value: ChildFilterValue;
  onChange: (value: ChildFilterValue) => void;
};

/** Переключатель «Все дети / конкретный ребёнок» с аватарами. */
export function ChildrenFilter({
  items,
  value,
  onChange,
}: ChildrenFilterProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container} accessibilityRole="tablist">
      <Segment
        label={t('wallet.all')}
        active={value === 'all'}
        onPress={() => onChange('all')}
      >
        <View style={styles.stack}>
          {items.map((child, index) => (
            <Image
              key={child.id}
              source={child.avatar}
              style={[
                styles.avatar,
                styles.stacked,
                index > 0 && styles.overlap,
              ]}
            />
          ))}
        </View>
      </Segment>
      {items.map((child) => (
        <Segment
          key={child.id}
          label={child.name}
          active={value === child.id}
          onPress={() => onChange(child.id)}
        >
          <Image source={child.avatar} style={styles.avatar} />
        </Segment>
      ))}
    </View>
  );
}

type SegmentProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  children: ReactNode;
};

function Segment({ label, active, onPress, children }: SegmentProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.segment, active && styles.segmentActive]}
    >
      {active && (
        <LinearGradient
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0.1 }}
          end={{ x: 1, y: 0.9 }}
          locations={[0, 0.7071]}
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
      <Text
        style={[styles.label, active && styles.labelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}
