import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { Icon, SelectMenu, type AnchorRect } from '@shared/ui';
import { theme } from '@shared/theme';
import { SUMMARY_PERIODS, type SummaryPeriod } from '../model/period';
import { styles } from './period-select.styled';

type PeriodSelectProps = {
  value: SummaryPeriod;
  onChange: (period: SummaryPeriod) => void;
};

/**
 * «Итоги за период … За неделю ⌄» — заголовок итогов: подпись слева, выбор
 * периода прижат к правому краю.
 */
export function PeriodSelect({ value, onChange }: PeriodSelectProps) {
  const { t } = useTranslation();
  const trigger = useRef<View>(null);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [open, setOpen] = useState(false);
  const options = SUMMARY_PERIODS.map((period) => ({
    value: period,
    label: t(`period.${period}`),
  }));

  // Меню раскрывается у кнопки — меряем, где она сейчас на экране.
  const openMenu = () =>
    trigger.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{t('period.label')}</Text>
      <Pressable
        ref={trigger}
        accessibilityRole="button"
        accessibilityLabel={`${t('period.label')} ${t(`period.${value}`)}`}
        onPress={openMenu}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Text style={styles.value}>{t(`period.${value}`)}</Text>
        <View style={[styles.chevron, open && styles.chevronOpen]}>
          <Icon name="chevron-right" size={16} color={theme.colors.violet} />
        </View>
      </Pressable>
      <SelectMenu
        visible={open}
        anchor={anchor}
        align="right"
        options={options}
        value={value}
        onSelect={onChange}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}
