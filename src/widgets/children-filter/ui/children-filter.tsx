import type { ReactNode } from 'react';
import { Pressable, Text, View, type ImageSourcePropType } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { LetterAvatar } from '@shared/ui';
import { styles } from './children-filter.styled';

type FilterChild = {
  /** У моков число строкой, с сервера — UUID. */
  id: string;
  name: string;
  /** null — фото нет, буква имени. */
  avatar: ImageSourcePropType | null;
};

/** 'all' — все дети, иначе id ребёнка. */
export type ChildFilterValue = 'all' | string;

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
        label={t('rewardsHistory.all')}
        active={value === 'all'}
        onPress={() => onChange('all')}
      >
        <View style={styles.stack}>
          {items.map((child, index) => (
            <LetterAvatar
              key={child.id}
              source={child.avatar}
              name={child.name}
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
          <LetterAvatar
            source={child.avatar}
            name={child.name}
            style={styles.avatar}
          />
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
