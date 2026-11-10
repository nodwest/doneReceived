import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceKeys, revokeDevice } from '@entities/device';

/**
 * Отключить устройство ребёнка: сервер отзывает его сессии, список
 * устройств этого ребёнка перечитывается.
 */
export function useRevokeDevice(familyId: string, childId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => revokeDevice(familyId, deviceId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: deviceKeys.child(familyId, childId),
      }),
  });
}
