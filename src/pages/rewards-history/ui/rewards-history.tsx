import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
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
import { TaskIconBadge } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { formatMonthDay } from '@shared/lib';
import { childAccountMock, childrenMock } from '@shared/mocks';
import { RoundButton } from '@shared/ui';
import { styles } from './rewards-history.styled';

const NO_OPERATIONS: Operation[] = [];

/**
 * История наград по дням (открывается из Wallet и «See all» в профилях):
 * заработанные и упущенные награды на графике, итоги и награды выбранного дня.
 * С childId — история одного ребёнка от его лица: без фильтра по детям, в
 * голубых тонах, в строках вместо аватара значок задания.
 */
export function RewardsHistoryPage({ childId }: { childId?: number }) {
  const { t } = useTranslation();
  const { data: operations = NO_OPERATIONS, isPending } = useOperations();
  // Сегодня фиксируем на время жизни экрана: от него строится лента дней.
  const [today] = useState(() => new Date());
  // «See all» в профиле ребёнка открывает историю сразу с его фильтром.
  const { child: childParam } = useLocalSearchParams<{ child?: string }>();
  const [selectedChild, setFilter] = useState<ChildFilterValue>(
    () =>
      childrenMock.find((child) => String(child.id) === childParam)?.id ??
      'all',
  );
  const filter = childId ?? selectedChild;
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
        <View style={styles.header}>
          <RoundButton
            icon="arrow-left"
            accessibilityLabel={t('common.back')}
            // Назад — туда, откуда пришли (Wallet, профиль); без истории
            // (открыли по ссылке) — в Wallet.
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace('/wallet')
            }
          />
          <Text style={styles.title}>{t('rewardsHistory.title')}</Text>
        </View>
        {childId === undefined ? (
          <View style={styles.filter}>
            <ChildrenFilter
              items={childrenMock}
              value={filter}
              onChange={setFilter}
            />
          </View>
        ) : (
          <View style={styles.noFilter} />
        )}
        {!isPending && (
          <>
            <OperationsChart
              days={totals}
              selectedIndex={selectedIndex}
              onSelect={setSelected}
              tone={childId === undefined ? 'parent' : 'child'}
            />
            <View style={styles.summary}>
              <DaySummary
                inline
                title={formatMonthDay(day.date)}
                earned={day.earned}
                missed={day.missed}
              />
            </View>
            <View style={styles.list}>
              {dayOperations.length === 0 ? (
                <Text style={styles.empty}>
                  {t('rewardsHistory.noRewardsThisDay')}
                </Text>
              ) : (
                dayOperations.map((operation) =>
                  childId === undefined ? (
                    <OperationRow key={operation.id} {...operation} />
                  ) : (
                    <OperationRow
                      key={operation.id}
                      {...operation}
                      caption="time"
                      leading={<TaskIconBadge size={44} />}
                    />
                  ),
                )
              )}
            </View>
          </>
        )}
      </ScrollView>
    </TabScreen>
  );
}

/** История наград ребёнка от его лица (Emma, временный режим ребёнка). */
export const ChildRewardsHistoryPage = () => (
  <RewardsHistoryPage childId={childAccountMock.id} />
);
