import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import {
  ChildrenFilter,
  type ChildFilterValue,
} from '@widgets/children-filter';
import { DaySummary } from '@widgets/day-summary';
import { OperationsChart } from '@widgets/operations-chart';
import {
  getDayTotals,
  getHistoryDays,
  isSameDay,
  OperationRow,
  useOperations,
  type Operation,
} from '@entities/operation';
import { formatMonthDay } from '@shared/lib';
import { childrenMock } from '@shared/mocks';
import { styles } from './wallet.styled';

const NO_OPERATIONS: Operation[] = [];

/** Вкладка Wallet: история операций по дням. */
export function WalletPage() {
  const { data: operations = NO_OPERATIONS, isPending } = useOperations();
  // Сегодня фиксируем на время жизни экрана: от него строится лента дней.
  const [today] = useState(() => new Date());
  // «See all» в профиле ребёнка открывает историю сразу с его фильтром.
  const { child: childParam } = useLocalSearchParams<{ child?: string }>();
  const [filter, setFilter] = useState<ChildFilterValue>(
    () =>
      childrenMock.find((child) => String(child.id) === childParam)?.id ??
      'all',
  );
  // null — день не выбран, стоим на сегодняшнем (последнем).
  const [selected, setSelected] = useState<number | null>(null);

  // Лента дней общая для всех детей, чтобы при смене фильтра не прыгала.
  const days = useMemo(
    () => getHistoryDays(operations, today),
    [operations, today],
  );
  const filtered = useMemo(
    () =>
      filter === 'all'
        ? operations
        : operations.filter((operation) => operation.child.id === filter),
    [operations, filter],
  );
  const totals = useMemo(() => getDayTotals(days, filtered), [days, filtered]);

  const selectedIndex = selected ?? days.length - 1;
  const day = totals[selectedIndex];
  // В списке — начисленные награды; упущенные видны в итогах и на графике.
  const dayOperations = filtered.filter(
    (operation) =>
      operation.kind === 'earned' && isSameDay(operation, day.date),
  );

  return (
    <TabScreen activeKey="wallet">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Operations history</Text>
        <View style={styles.filter}>
          <ChildrenFilter
            items={childrenMock}
            value={filter}
            onChange={setFilter}
          />
        </View>
        {!isPending && (
          <>
            <OperationsChart
              days={totals}
              selectedIndex={selectedIndex}
              onSelect={setSelected}
            />
            <View style={styles.summary}>
              <DaySummary
                title={formatMonthDay(day.date)}
                earned={day.earned}
                missed={day.missed}
              />
            </View>
            <View style={styles.list}>
              {dayOperations.length === 0 ? (
                <Text style={styles.empty}>No rewards this day</Text>
              ) : (
                dayOperations.map((operation) => (
                  <OperationRow key={operation.id} {...operation} />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </TabScreen>
  );
}
