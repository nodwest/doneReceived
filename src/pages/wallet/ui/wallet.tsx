import { Fragment, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { DepositSheet } from '@features/deposit-funds';
import { useCurrentFamily, useFamilyChildren } from '@entities/family';
import { TransactionRow, useParentFunds, useWallet } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { childProfilesMock } from '@shared/mocks';
import { SectionHeader } from '@shared/ui';
import { BalanceCard } from './balance-card';
import { ChildBalance } from './child-balance';
import { RewardsHistoryLink } from './rewards-history-link';
import { styles } from './wallet.styled';

// Тап по транзакции — её карточка в истории транзакций.
const openTransaction = (id: number) =>
  router.push({
    pathname: '/transactions',
    params: { transaction: String(id) },
  });

// Сколько последних транзакций показываем; остальные — по «See all».
const RECENT_TRANSACTIONS = 4;

/**
 * Вкладка Wallet: деньги вошедшего родителя (не всей семьи) — доступное на
 * задания и резерв за невыплаченные (с сервера) — с кнопками ввода и вывода
 * денег (Deposit — шторка тестового пополнения), балансы детей, ссылка на историю наград и последние
 * транзакции; «See all» — вся история транзакций. Deposit и Withdraw пока
 * ничего не делают.
 */
export function WalletPage() {
  const { t } = useTranslation();
  // Транзакции пока на моках, деньги родителя — с сервера.
  const { data: wallet } = useWallet();
  const familyId = useCurrentFamily()?.id ?? null;
  const { data: funds } = useParentFunds(familyId);
  // Балансы детей: моковые Emma и Liam и дети семьи с сервера.
  const { data: serverChildren = [] } = useFamilyChildren(familyId);
  const [depositOpen, setDepositOpen] = useState(false);
  const transactions = wallet?.transactions.slice(0, RECENT_TRANSACTIONS) ?? [];

  return (
    <TabScreen activeKey="wallet">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('wallet.title')}</Text>
        <BalanceCard funds={funds} onDeposit={() => setDepositOpen(true)} />
        <View style={styles.children}>
          {childProfilesMock.map((child) => (
            <ChildBalance
              key={child.id}
              childId={String(child.id)}
              name={child.name}
              avatar={child.avatar}
            />
          ))}
          {serverChildren.map((child) => (
            <ChildBalance
              key={child.id}
              childId={child.id}
              familyId={familyId}
              name={child.displayName}
              avatar={child.avatarUrl ? { uri: child.avatarUrl } : null}
            />
          ))}
        </View>
        <RewardsHistoryLink onPress={() => router.push('/rewards-history')} />
        <View style={styles.sectionHeader}>
          <SectionHeader
            title={t('wallet.transactions')}
            actionLabel={t('common.seeAll')}
            onAction={() => router.push('/transactions')}
          />
        </View>
        {wallet && (
          <View style={styles.transactions}>
            {transactions.length === 0 ? (
              <Text style={styles.empty}>{t('wallet.noTransactions')}</Text>
            ) : (
              transactions.map((transaction, index) => (
                <Fragment key={transaction.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <TransactionRow
                    transaction={transaction}
                    onPress={() => openTransaction(transaction.id)}
                  />
                </Fragment>
              ))
            )}
          </View>
        )}
      </ScrollView>
      <DepositSheet
        visible={depositOpen}
        onClose={() => setDepositOpen(false)}
        familyId={familyId}
      />
    </TabScreen>
  );
}
