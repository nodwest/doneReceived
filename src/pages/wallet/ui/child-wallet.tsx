import { Fragment, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { WishlistStub } from '@widgets/wishlist-preview';
import {
  OperationRow,
  operationsInPeriod,
  sortByNewest,
  useOperations,
  type Operation,
} from '@entities/operation';
import { TaskIconBadge } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import {
  childAccountMock,
  childProfilesMock,
  wishlistPreviewMock,
} from '@shared/mocks';
import { SectionHeader } from '@shared/ui';
import { BalanceCard } from './balance-card';
import { RewardsHistoryLink } from './rewards-history-link';
import { styles } from './wallet.styled';

const NO_OPERATIONS: Operation[] = [];
// Сколько последних наград показываем; остальные — в истории по «See all».
const RECENT_REWARDS = 4;

/**
 * Вкладка Wallet у ребёнка (Emma, временный режим ребёнка): баланс с
 * заработанным за неделю и Withdraw (пока не работает), заглушка вишлиста,
 * ссылка на историю наград и последние начисленные награды.
 */
export function ChildWalletPage() {
  const { t } = useTranslation();
  const { data: operations = NO_OPERATIONS } = useOperations();
  const [today] = useState(() => new Date());
  const earned = useMemo(
    () =>
      sortByNewest(
        operations.filter(
          (operation) =>
            operation.child.id === childAccountMock.id &&
            operation.kind === 'earned',
        ),
      ),
    [operations],
  );
  const weekEarned = operationsInPeriod(earned, 'week', today).reduce(
    (sum, operation) => sum + operation.amount,
    0,
  );
  const balance =
    childProfilesMock.find((child) => child.id === childAccountMock.id)
      ?.balance ?? 0;
  const recent = earned.slice(0, RECENT_REWARDS);
  const openHistory = () => router.push('/rewards-history');

  return (
    <TabScreen activeKey="wallet">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('wallet.title')}</Text>
        <BalanceCard role="child" balance={balance} weekEarned={weekEarned} />
        <WishlistStub {...wishlistPreviewMock} />
        <RewardsHistoryLink onPress={openHistory} />
        <View style={styles.sectionHeader}>
          <SectionHeader
            title={t('wallet.recentRewards')}
            actionLabel={t('common.seeAll')}
            onAction={openHistory}
          />
        </View>
        <View style={styles.transactions}>
          {recent.length === 0 ? (
            <Text style={styles.empty}>{t('wallet.noRewards')}</Text>
          ) : (
            recent.map((operation, index) => (
              <Fragment key={operation.id}>
                {index > 0 && <View style={styles.divider} />}
                <OperationRow
                  {...operation}
                  variant="plain"
                  caption="day"
                  leading={<TaskIconBadge size={40} />}
                />
              </Fragment>
            ))
          )}
        </View>
      </ScrollView>
    </TabScreen>
  );
}
