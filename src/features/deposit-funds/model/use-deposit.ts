import { useMutation, useQueryClient } from '@tanstack/react-query';
import { depositFunds, walletKeys } from '@entities/wallet';
import { syncData } from '@shared/api';

/**
 * Пополнить кошелёк вошедшего родителя (временное тестовое пополнение):
 * ответ сервера — кошелёк после пополнения, сразу кладём его в кэш, а
 * историю транзакций перечитываем.
 */
export function useDeposit(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      amount,
      clientRequestId,
    }: {
      amount: number;
      clientRequestId?: string;
    }) => {
      if (!familyId) throw new Error('No family');
      return depositFunds(familyId, amount, clientRequestId);
    },
    onSettled: (funds) => {
      if (funds) queryClient.setQueryData(walletKeys.funds(familyId), funds);
      // Пополнение — новая строка в истории транзакций и в ленте. Перечитываем
      // и при ошибке: ответ мог потеряться после успешного коммита.
      return syncData(queryClient, 'funds-deposited');
    },
  });
}
