import { useState } from 'react';
import { Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme, tracking, useTheme } from '@shared/theme';
import { BottomSheet, Icon, PillButton } from '@shared/ui';

export type DeleteAccountStep = 'confirm' | 'balance' | null;

type DeleteAccountSheetProps = {
  step: DeleteAccountStep;
  balance?: string;
  profileName?: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteAccountSheet({
  step,
  balance,
  deleting,
  onClose,
  onConfirm,
  profileName,
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
              : profileName
                ? t('family.deleteChildConfirmTitle', { name: profileName })
                : t('deleteAccount.confirmTitle')}
          </Text>
          <Text style={styles.subtitle}>
            {hasBalance
              ? t('deleteAccount.balanceMessage', {
                  amount: balance ?? '',
                })
              : profileName
                ? t('family.deleteChildConfirmMessage')
                : t('deleteAccount.confirmMessage')}
          </Text>
        </View>
        <View style={styles.actions}>
          <PillButton
            label={t(
              hasBalance ? 'deleteAccount.delete' : 'deleteAccount.confirm',
            )}
            variant={hasBalance ? 'outline' : 'danger'}
            onPress={onConfirm}
            disabled={deleting}
          />
          <PillButton
            label={t('common.cancel')}
            variant={hasBalance ? 'primary' : 'ghost'}
            onPress={close}
            disabled={deleting}
          />
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
    color: colors.inkSoft,
  },
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 12,
  },
}));
