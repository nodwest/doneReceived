import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme, tracking } from '@shared/theme';
import { BottomSheet, CardButton, Icon, PillButton } from '@shared/ui';
import { useTransferOwnership } from '../model/use-transfer-ownership';

type TransferOwnershipButtonProps = {
  familyId: string | null;
  /** Членство родителя, которому передаём семью. */
  memberId: string;
  name: string;
};

/**
 * «Make owner» внизу карточки второго родителя (видит только владелец) и
 * шторка подтверждения: владелец станет обычным родителем (admin).
 */
export function TransferOwnershipButton({
  familyId,
  memberId,
  name,
}: TransferOwnershipButtonProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const transfer = useTransferOwnership(familyId);

  const confirm = () => {
    setOpen(false);
    transfer.mutate(memberId, {
      onSuccess: () => showToast(t('transferOwnership.doneToast', { name })),
      onError: () => showToast(t('transferOwnership.failed')),
    });
  };

  return (
    <>
      <CardButton
        label={t('transferOwnership.button')}
        variant="outline"
        size="md"
        icon="star"
        disabled={transfer.isPending}
        onPress={() => setOpen(true)}
      />
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <View style={styles.body}>
          <View style={styles.icon}>
            <Icon name="star" size={24} color={theme.colors.violet} />
          </View>
          <View style={styles.header}>
            <Text style={styles.title}>{t('transferOwnership.title')}</Text>
            <Text style={styles.subtitle}>
              {t('transferOwnership.subtitle', { name })}
            </Text>
          </View>
          <View style={styles.actions}>
            <PillButton
              label={t('common.cancel')}
              variant="ghost"
              size="md"
              onPress={() => setOpen(false)}
            />
            <PillButton
              label={t('transferOwnership.confirm')}
              size="md"
              onPress={confirm}
            />
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: theme.colors.violetSoft,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 12,
  },
});
