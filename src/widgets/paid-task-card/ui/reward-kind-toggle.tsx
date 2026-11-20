import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { OperationKind } from '@entities/operation';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme, themedValue, tracking } from '@shared/theme';

type RewardKindToggleProps = {
  value: OperationKind;
  onChange: (value: OperationKind) => void;
};

const GRADIENTS = themedValue<Record<OperationKind, readonly [string, string]>>(
  () => ({
    earned: [theme.colors.heroPaidFrom, theme.colors.earnedDark],
    missed: [theme.colors.missedHeroFrom, theme.colors.missedHeroTo],
  }),
);

const KINDS: readonly OperationKind[] = ['earned', 'missed'];

/**
 * Тогл в шапке карточек и списка наград: Done — выплаченные (зелёный),
 * Missed — упущенные (графит). Выбранный сегмент шире и на градиенте.
 */
export function RewardKindToggle({ value, onChange }: RewardKindToggleProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {KINDS.map((kind) => {
        const selected = kind === value;
        const label =
          kind === 'earned'
            ? t('rewardsHistory.done')
            : t('rewardsHistory.missed');
        return (
          <Pressable
            key={kind}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected }}
            onPress={() => onChange(kind)}
            style={[
              styles.segment,
              selected && styles.segmentSelected,
              selected && styles[kind],
            ]}
          >
            {selected && (
              <LinearGradient
                colors={GRADIENTS[kind]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text
              style={[styles.label, selected && styles.labelSelected]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = createStyles((colors) => ({
  bar: {
    width: '100%',
    maxWidth: 212,
    height: 44,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.04)',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    overflow: 'hidden',
  },
  segmentSelected: {
    flex: 1.4,
  },
  earned: {
    boxShadow: '0px 3px 8px rgba(26, 133, 79, 0.3)',
  },
  missed: {
    boxShadow: '0px 3px 8px rgba(75, 84, 104, 0.3)',
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
