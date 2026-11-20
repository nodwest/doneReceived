import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createStyles, theme, themedValue, tracking } from '../theme';

type Option<T extends string> = { value: T; label: string };

type SegmentedFilterProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Цвет выбранного: фиолетовый у родителя, голубой у ребёнка. */
  tone?: 'parent' | 'child';
};

const GRADIENTS = themedValue<
  Record<'parent' | 'child', readonly [string, string]>
>(() => ({
  parent: [theme.colors.violet, theme.colors.blue],
  child: [theme.colors.childFrom, theme.colors.childDeep],
}));

/** Белая полоса с вариантами фильтра, выбранный — на цветной плашке. */
export function SegmentedFilter<T extends string>({
  options,
  value,
  onChange,
  tone = 'parent',
}: SegmentedFilterProps<T>) {
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            {selected && (
              <LinearGradient
                colors={GRADIENTS[tone]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text
              style={[styles.label, selected && styles.labelSelected]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = createStyles((colors) => ({
  bar: {
    height: 48,
    flexDirection: 'row',
    gap: 4,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
  },
  // Ширина — по подписи («All» узкий, «Withdrawals» шире), остаток делится
  // поровну.
  segment: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  segmentSelected: {
    boxShadow: '0px 3px 8px rgba(108, 92, 231, 0.25)',
  },
  label: {
    fontSize: 13,
    letterSpacing: tracking(13),
    fontFamily: theme.fonts.medium,
    color: colors.ink,
  },
  labelSelected: {
    fontFamily: theme.fonts.semibold,
    color: colors.white,
  },
}));
