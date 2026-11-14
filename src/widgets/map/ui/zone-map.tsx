import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme, tracking } from '@shared/theme';
import type { ZonePoint } from '@entities/zone';

type ZoneMapProps = {
  points: readonly ZonePoint[];
  selectedIndex: number | null;
  onAddPoint: (point: ZonePoint) => void;
  onSelectPoint: (index: number) => void;
  onMovePoint: (index: number, point: ZonePoint) => void;
  center?: ZonePoint;
};

/** Карта редактора области есть только в вебе: на нативе — заглушка. */
export function ZoneMap(_props: ZoneMapProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.placeholder}>
      <Text style={styles.text}>{t('map.webOnly')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: theme.colors.mapPlaceholder,
  },
  text: {
    textAlign: 'center',
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});
