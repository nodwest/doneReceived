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
    mutationFn: (amount: number) => {
      if (!familyId) throw new Error('No family');
      return depositFunds(familyId, amount);
    },
    onSuccess: (funds) => {
      queryClient.setQueryData(walletKeys.funds(familyId), funds);
      // Пополнение — новая строка в истории транзакций и в ленте.
      return syncData(queryClient, 'funds-deposited');
    },
  });
}
