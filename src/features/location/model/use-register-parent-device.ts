import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentFamily } from '@entities/family';
import {
  useMyId,
  useSessionFamilyId,
  useSessionKind,
  useSessionStore,
} from '@entities/session';
import { apiRequest, queryRoots } from '@shared/api';
import { i18n } from '@shared/i18n';
import { deviceLabel, installationId, showToast } from '@shared/lib';

type RegisteredDevice = { tracked?: boolean };

/**
 * Родительское устройство нужно, чтобы сервер знал, с какого устройства
 * пришла точка, и мог выбрать одно отслеживаемое устройство. Регистрация
 * идемпотентна: повторный вход обновляет label и lastSeen.
 */
export function useRegisterParentDevice() {
  const token = useSessionStore((state) => state.session?.accessToken ?? null);
  const kind = useSessionKind();
  const cachedFamilyId = useCurrentFamily()?.id ?? null;
  const sessionFamilyId = useSessionFamilyId();
  const familyId = cachedFamilyId ?? sessionFamilyId;
  const queryClient = useQueryClient();
  const myId = useMyId();
  const warnedFor = useRef<string | null>(null);

  useEffect(() => {
    // Без семьи сервер отклонит регистрацию; ждём, пока она появится.
    if (!token || kind !== 'parent' || !familyId) return;
    void apiRequest<RegisteredDevice>('/users/me/devices', {
      method: 'POST',
      body: { label: deviceLabel(), installationId: installationId() },
    })
      .then((device) => {
        void queryClient.invalidateQueries({ queryKey: queryRoots.families });
        // Выбрано другое устройство — точки с этого сервер отклонит.
        if (device.tracked === false && warnedFor.current !== myId) {
          warnedFor.current = myId;
          showToast(i18n.t('map.deviceNotTracked'));
        }
      })
      .catch(() => {
        // Без регистрации устройства геопозиция всё равно может прийти,
        // но выбрать её в настройках будет нельзя.
      });
  }, [familyId, kind, myId, queryClient, token]);
}
