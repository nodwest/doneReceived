import { useMutation, useQueryClient } from '@tanstack/react-query';
import { familiesKeys } from '@entities/family';
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
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: deviceKeys.child(familyId, childId),
        }),
        // Число устройств на карточке ребёнка в Family.
        queryClient.invalidateQueries({
          queryKey: familiesKeys.details(familyId),
        }),
      ]),
  });
}
