import { useMutation } from '@tanstack/react-query';
import { connectCodeForApi } from '@entities/device';
import { pairChildDevice, useSessionStore } from '@entities/session';
import { useViewerRoleStore } from '@entities/user';
import { deviceLabel } from '@shared/lib';

/**
 * «That's me — continue»: подключить это устройство к профилю ребёнка по
 * коду (POST /child-devices/pair). Сервер гасит код и отдаёт сессию ребёнка —
 * сохраняем её, как при входе родителя, и смотрим приложение от лица
 * ребёнка. Родитель увидит устройство под названием из `deviceLabel`.
 */
export function usePairDevice() {
  const signIn = useSessionStore((state) => state.signIn);
  const setRole = useViewerRoleStore((state) => state.setRole);
  return useMutation({
    mutationFn: (code: string) =>
      pairChildDevice({ code: connectCodeForApi(code), label: deviceLabel() }),
    onSuccess: async ({ accessToken, refreshToken, user }) => {
      setRole('child');
      await signIn({ accessToken, refreshToken, user });
    },
  });
}
