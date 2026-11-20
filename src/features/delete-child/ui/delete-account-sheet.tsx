import { useState } from 'react';
import { Text, View } from 'react-native';
import { formatMoney } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme, tracking, useTheme } from '@shared/theme';
import { BottomSheet, Icon, PillButton } from '@shared/ui';

/**
 * Какая шторка открыта: «вы уверены?» (баланс нулевой) или «сначала
 * выведите деньги» (на счету не ноль); null — закрыта.
 */
export type DeleteAccountStep = 'confirm' | 'balance' | null;

type DeleteAccountSheetProps = {
  step: DeleteAccountStep;
  balance: number;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onWithdraw: () => void;
};

/**
 * Шторка после кнопки Delete на странице удаления аккаунта. Баланс нулевой —
 * «восстановить не получится, вы уверены?»: Cancel / Delete account. На счету
 * есть деньги — «сначала выведите все деньги»: Cancel / Withdraw.
 */
export function DeleteAccountSheet({
  step,
  balance,
  deleting,
  onClose,
  onConfirm,
  onWithdraw,
}: DeleteAccountSheetProps) {
  useTheme();
  const { t } = useTranslation();
  // Пока шторка уезжает (step уже null), показываем то, что было открыто,
  // иначе на время закрытия мелькнуло бы «Вы уверены?».
  const [shown, setShown] = useState<DeleteAccountStep>(step);
  if (step !== null && step !== shown) setShown(step);
  const hasBalance = shown === 'balance';
  // Пока идёт удаление, шторку не закрыть: ни «Отменой», ни тапом мимо.
  const close = () => {
    if (!deleting) onClose();
  };
  return (
    <BottomSheet visible={step !== null} onClose={close}>
      <View style={styles.body}>
        <View style={[styles.icon, hasBalance && styles.iconBalance]}>
          <Icon
            name={hasBalance ? 'wallet' : 'trash'}
            size={24}
            color={
              hasBalance ? theme.colors.childDeep : theme.colors.dangerText
            }
          />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>
            {hasBalance
              ? t('deleteAccount.balanceTitle')
              : t('deleteAccount.confirmTitle')}
          </Text>
          <Text style={styles.subtitle}>
            {hasBalance
              ? t('deleteAccount.balanceMessage', {
                  amount: formatMoney(balance),
                })
              : t('deleteAccount.confirmMessage')}
          </Text>
        </View>
        <View style={styles.actions}>
          <PillButton
            label={t('common.cancel')}
            variant="ghost"
            onPress={close}
            disabled={deleting}
          />
          {hasBalance ? (
            <PillButton
              label={t('wallet.withdrawAction')}
              variant="child"
              onPress={onWithdraw}
            />
          ) : (
            <PillButton
              label={t('deleteAccount.confirm')}
              variant="danger"
              onPress={onConfirm}
              disabled={deleting}
            />
          )}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = createStyles((colors) => ({
  body: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSoft,
  },
  iconBalance: {
    backgroundColor: colors.childTint,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    textAlign: 'center',
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 12,
  },
}));
