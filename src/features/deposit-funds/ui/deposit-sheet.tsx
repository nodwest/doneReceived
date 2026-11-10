import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatMoney } from '@entities/wallet';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { BottomSheet, Icon, SheetField } from '@shared/ui';
import { useDeposit } from '../model/use-deposit';
import { styles } from './deposit-sheet.styled';

/** Быстрые суммы пополнения. */
const PRESETS = [50, 100, 500, 1000] as const;

/** Сколько можно пополнить за раз (правило сервера). */
const MAX_AMOUNT = 1_000_000;

type DepositSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Семья вошедшего родителя: кошелёк у него свой, familyId только в адресе. */
  familyId: string | null;
};

/**
 * Шторка Deposit: сумма в целых долларах (поле или быстрые суммы) и кнопка
 * «Deposit $N». Пока это тестовое пополнение условными деньгами — настоящих
 * платежей нет. Пополнили — тост, шторка закрывается, кошелёк обновлён.
 */
export function DepositSheet({
  visible,
  onClose,
  familyId,
}: DepositSheetProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const deposit = useDeposit(familyId);
  const amount = Number(value) || 0;
  const valid = amount >= 1 && amount <= MAX_AMOUNT;
  const disabled = !valid || deposit.isPending;

  const close = () => {
    setValue('');
    deposit.reset();
    onClose();
  };

  const submit = () => {
    if (disabled) return;
    deposit.mutate(amount, {
      onSuccess: () => {
        showToast(t('deposit.done', { amount: formatMoney(amount) }));
        close();
      },
      onError: (error) =>
        showToast(
          isApiError(error) && error.status === 404
            ? t('deposit.disabled')
            : t('deposit.failed'),
        ),
    });
  };

  return (
    <BottomSheet visible={visible} onClose={close} maxHeightRatio={0.8}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('deposit.title')}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            onPress={close}
            style={styles.close}
          >
            <Icon name="close" size={14} color={theme.colors.ink} />
          </Pressable>
        </View>
        <SheetField
          label={t('deposit.amount')}
          prefix={<Text style={styles.dollar}>$</Text>}
          value={value}
          onChangeText={(text) => setValue(text.replace(/\D/g, ''))}
          placeholder="0"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={7}
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <View style={styles.presets}>
          {PRESETS.map((preset) => {
            const selected = amount === preset;
            return (
              <Pressable
                key={preset}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setValue(String(preset))}
                style={({ pressed }) => [
                  styles.preset,
                  selected && styles.presetSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.presetLabel,
                    selected && styles.presetLabelSelected,
                  ]}
                >
                  {formatMoney(preset)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.hint}>{t('deposit.testHint')}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={submit}
          style={({ pressed }) => [
            styles.button,
            disabled && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <LinearGradient
            colors={[theme.colors.parentTo, theme.colors.parentFrom]}
            start={{ x: 0.4, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            locations={[0, 0.7071]}
            style={StyleSheet.absoluteFill}
          />
          <Icon name="plus" size={16} color={theme.colors.white} />
          <Text style={styles.buttonLabel}>
            {valid
              ? t('deposit.action', { amount: formatMoney(amount) })
              : t('deposit.actionEmpty')}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
