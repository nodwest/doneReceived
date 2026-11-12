import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskForm } from '@features/create-task';
import { DepositSheet } from '@features/deposit-funds';
import { useCurrentFamily, useFamilyChildren } from '@entities/family';
import type { UpdateTaskPayload } from '@entities/task';
import type { ChipChild } from '@entities/user';
import { useParentFunds } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { RoundButton } from '@shared/ui';
import { showToast, useIsCompact } from '@shared/lib';
import { childrenMock, rewardPresetsMock } from '@shared/mocks';
import { styles } from './create-task.styled';

type TaskFormScreenProps = {
  title: string;
  /** Тост после успешной отправки. */
  successMessage: string;
  task?: UpdateTaskPayload;
};

/** Модальный экран с формой задачи: создание и редактирование. */
export function TaskFormScreen({
  title,
  successMessage,
  task,
}: TaskFormScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const gutter = useIsCompact() ? 16 : 24;
  // Деньги родителя с сервера: доступное на награды и резерв.
  const familyId = useCurrentFamily()?.id ?? null;
  const { data: funds } = useParentFunds(familyId);
  const [depositOpen, setDepositOpen] = useState(false);
  // Кому назначить: моковые Emma и Liam и дети семьи с сервера.
  const { data: serverChildren } = useFamilyChildren(familyId);
  const assignees = useMemo<ChipChild[]>(
    () => [
      ...childrenMock.map((child) => ({
        id: String(child.id),
        name: child.name,
        avatar: child.avatar,
      })),
      ...(serverChildren ?? []).map((child) => ({
        id: child.id,
        name: child.displayName,
        avatar: child.avatarUrl ? { uri: child.avatarUrl } : null,
      })),
    ],
    [serverChildren],
  );

  // При открытии экрана напрямую (перезагрузка, deep link) истории нет.
  const close = () =>
    router.canGoBack() ? router.back() : router.replace('/');

  const handleSubmitted = () => {
    showToast(successMessage);
    close();
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: gutter }]}>
          {/* Пустышка слева держит заголовок по центру: справа стоит кнопка закрытия. */}
          <View style={styles.spacer} />
          <Text style={styles.title}>{title}</Text>
          <RoundButton
            icon="close"
            accessibilityLabel={t('common.close')}
            onPress={close}
          />
        </View>
        <CreateTaskForm
          assignees={assignees}
          rewardPresets={rewardPresetsMock}
          task={task}
          funds={funds}
          onDeposit={() => setDepositOpen(true)}
          onSubmitted={handleSubmitted}
        />
      </SafeAreaView>
      <DepositSheet
        visible={depositOpen}
        onClose={() => setDepositOpen(false)}
        familyId={familyId}
      />
    </View>
  );
}
