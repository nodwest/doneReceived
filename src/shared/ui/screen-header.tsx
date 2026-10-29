import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../i18n';
import { theme, tracking } from '../theme';
import { RoundButton } from './round-button';

type ScreenHeaderProps = {
  title: string;
  onBack: () => void;
  /** Справа: аватар, кнопка правки. Без него справа пустое место той же ширины. */
  right?: ReactNode;
};

// Ширина краёв шапки: заголовок по центру не заезжает под кнопку и аватар.
const SIDE = 48;

/** Шапка вложенного экрана: назад, заголовок по центру, элемент справа. */
export function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={onBack}
        />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  side: {
    width: SIDE,
  },
  right: {
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: tracking(24),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
});
