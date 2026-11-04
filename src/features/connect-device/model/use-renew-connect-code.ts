import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceKeys, renewConnectCode } from '@entities/device';

/** New code: новый код подключения сразу кладём в кэш — таймер с 15:00. */
export function useRenewConnectCode(childId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => renewConnectCode(childId),
    onSuccess: (code) =>
      queryClient.setQueryData(deviceKeys.connectCode(childId), code),
  });
}
