import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revokeDevice } from '@entities/device';
import { syncData } from '@shared/api';

/**
 * Отключить устройство ребёнка: сервер отзывает его сессии, список
 * устройств этого ребёнка перечитывается.
 */
export function useRevokeDevice(familyId: string, childId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: string) => revokeDevice(familyId, deviceId),
    // Список устройств и их число на карточке ребёнка в Family.
    onSuccess: () => syncData(queryClient, 'device-changed'),
  });
}
