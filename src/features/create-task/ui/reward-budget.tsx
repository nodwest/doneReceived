import { Pressable, Text, View } from 'react-native';
import {
  formatMoney,
  FundsBar,
  FundsLegendItem,
  type ParentFunds,
} from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './reward-budget.styled';

type RewardBudgetProps = {
  /** Деньги родителя без резерва этого задания (при правке он уже вычтен). */
  funds: ParentFunds;
  /** Сколько зарезервирует это задание. */
  amount: number;
  /** Deposit: открыть шторку пополнения. */
  onDeposit?: () => void;
};

/**
 * Карточка под наградой: сколько денег свободно на награды и во что обойдётся
 * это задание. Полоса — весь кошелёк: резерв других заданий (серый), это
 * задание (жёлтый, как поле награды), что останется (зелёный). Награда не
 * влезает — карточка красная, полоса растягивается и нехватка торчит красным
 * за край кошелька, подсказка, до скольки снизить, и Deposit.
 */
export function RewardBudget({ funds, amount, onDeposit }: RewardBudgetProps) {
  const { t } = useTranslation();
  const { total, reserved, available } = funds;
  const over = amount > available;
  const left = available - amount;
  const short = amount - available;
  const scale = over ? reserved + amount : total;

  return (
    <View style={[styles.card, over && styles.cardOver]}>
      <View style={styles.header}>
        <Icon
          name="wallet"
          size={18}
          color={over ? theme.colors.dangerText : theme.colors.violet}
        />
        <Text style={[styles.title, over && styles.titleOver]}>
          {over
            ? t('createTask.budget.notEnough')
            : t('createTask.budget.title')}
        </Text>
        <View style={styles.amount}>
          <Text style={[styles.amountValue, !over && styles.amountFree]}>
            {formatMoney(over ? available : left)}
          </Text>
          <Text style={styles.amountUnit}>
            {over ? t('createTask.budget.free') : t('createTask.budget.left')}
          </Text>
        </View>
      </View>
      <View style={styles.meter}>
        <FundsBar
          scale={scale}
          trackColor={over ? 'transparent' : theme.colors.line}
          segments={
            over
              ? [
                  {
                    key: 'reserved',
                    value: reserved,
                    color: theme.colors.fundsReserved,
                  },
                  { key: 'task', value: available, color: theme.colors.yellow },
                  {
                    key: 'short',
                    value: short,
                    color: theme.colors.dangerText,
                  },
                ]
              : [
                  {
                    key: 'reserved',
                    value: reserved,
                    color: theme.colors.fundsReserved,
                  },
                  { key: 'task', value: amount, color: theme.colors.yellow },
                  { key: 'left', value: left, color: theme.colors.fundsFree },
                ]
          }
        />
        {/* Граница кошелька: дальше — то, чего не хватает. */}
        {over && (
          <View style={styles.limitRow}>
            <View style={[styles.limit, { flexGrow: reserved + available }]}>
              <Text style={styles.limitText}>
                {t('createTask.budget.walletLimit', {
                  amount: formatMoney(total),
                })}
              </Text>
            </View>
            <View style={{ flexGrow: short }} />
          </View>
        )}
      </View>
      <View style={styles.legend}>
        <FundsLegendItem
          color={theme.colors.fundsReserved}
          label={t('createTask.budget.reserved')}
          value={formatMoney(reserved)}
        />
        <FundsLegendItem
          color={theme.colors.yellow}
          label={t('createTask.budget.thisTask')}
          value={formatMoney(amount)}
        />
        {over ? (
          <FundsLegendItem
            color={theme.colors.dangerText}
            label={t('createTask.budget.short')}
            value={formatMoney(short)}
            valueColor={theme.colors.dangerText}
          />
        ) : (
          <FundsLegendItem
            color={theme.colors.fundsFree}
            label={t('createTask.budget.leftLabel')}
            value={formatMoney(left)}
            valueColor={theme.colors.fundsFree}
          />
        )}
      </View>
      {/* Не влезает — как исправить: снизить награду или пополнить кошелёк. */}
      {over && (
        <View style={styles.footer}>
          <Text style={styles.note}>
            {t('createTask.budget.noteOver', {
              amount: formatMoney(available),
            })}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onDeposit}
            style={({ pressed }) => [styles.deposit, pressed && styles.pressed]}
          >
            <Icon name="plus" size={16} color={theme.colors.white} />
            <Text style={styles.depositLabel}>{t('wallet.depositAction')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
