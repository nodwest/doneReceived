import { Text, View } from 'react-native';
import { theme } from '@shared/theme';
import { Icon, type IconName } from '@shared/ui';
import { styles } from './calendar-event.styled';

type EventTileProps = {
  icon: IconName;
  /** amber — врач и другие «тёплые» события, blue — кино и прогулки. */
  tone?: 'blue' | 'amber';
  /** «Сб» или «19 ноя» — подпись в правом верхнем углу. */
  dayLabel: string;
  title: string;
  meta: string;
};

/** Маленькая карточка ближайшего события: иконка, день, название и время. */
export function EventTile({
  icon,
  tone = 'blue',
  dayLabel,
  title,
  meta,
}: EventTileProps) {
  const amber = tone === 'amber';
  return (
    <View
      accessible
      accessibilityLabel={`${title}. ${meta}`}
      style={styles.tile}
    >
      <View style={styles.tileTop}>
        <View
          style={[
            styles.iconTile,
            amber ? styles.iconTileAmber : styles.iconTileBlue,
          ]}
        >
          <Icon
            name={icon}
            size={18}
            color={amber ? theme.colors.reviewText : theme.colors.blue}
          />
        </View>
        <View style={[styles.dayChip, amber && styles.dayChipAmber]}>
          <Text style={[styles.dayText, amber && styles.dayTextAmber]}>
            {dayLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.tileTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.tileMeta} numberOfLines={2}>
        {meta}
      </Text>
    </View>
  );
}
