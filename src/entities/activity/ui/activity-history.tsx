import { Text, View, type StyleProp, type TextStyle } from 'react-native';
import { styles } from './activity-history.styled';

/** Шаг статуса в истории задания. */
export interface ActivityStep {
  id: string;
  /** Статус с заглавной буквы: «On review». */
  label: string;
  /** Кто и когда: «Sarah · yesterday, 9:30 AM». */
  detail: string;
  /** Цвет точки: свой у каждого статуса. */
  color: string;
}

type ActivityHistoryProps = {
  /** Шаги от старого к новому. */
  steps: ActivityStep[];
  /** Цвет линии между точками. */
  lineColor: string;
  /** Цвет последнего, текущего статуса — как у статуса в шапке карточки. */
  currentStyle: StyleProp<TextStyle>;
};

/** Раскрытая история задания: статусы сверху вниз, последний выделен. */
export function ActivityHistory({
  steps,
  lineColor,
  currentStyle,
}: ActivityHistoryProps) {
  return (
    <View style={styles.panel}>
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <View key={step.id} style={styles.step} accessible>
            <View style={styles.rail}>
              <View
                style={[
                  styles.lineTop,
                  index > 0 && { backgroundColor: lineColor },
                ]}
              />
              <View style={[styles.dot, { backgroundColor: step.color }]} />
              {!last && (
                <View style={[styles.line, { backgroundColor: lineColor }]} />
              )}
            </View>
            <View style={[styles.text, !last && styles.textGap]}>
              <Text
                style={[styles.label, last && [styles.current, currentStyle]]}
              >
                {step.label}
              </Text>
              <Text style={styles.detail}>{step.detail}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
