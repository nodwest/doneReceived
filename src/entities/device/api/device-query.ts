import { skipToken, useQuery } from '@tanstack/react-query';
import type { ConnectCode } from '../model/device';
import {
  fetchChildDevices,
  fetchConnectCode,
  fetchMockDevices,
  previewPairing,
} from './device-api';

/** Ключи кэша устройств. */
export const deviceKeys = {
  all: ['devices'] as const,
  mockList: () => [...deviceKeys.all, 'mock'] as const,
  child: (familyId: string | null, childId: string) =>
    [...deviceKeys.all, familyId, childId] as const,
  connectCode: (childId: string) =>
    [...deviceKeys.all, 'connect-code', childId] as const,
  preview: (code: string) => [...deviceKeys.all, 'preview', code] as const,
};

/** Устройства моковых детей (Emma, Liam). */
export function useMockDevices() {
  return useQuery({
    queryKey: deviceKeys.mockList(),
    queryFn: fetchMockDevices,
  });
}

/** Устройства ребёнка с сервера; без семьи (null) запроса нет. */
export function useChildDevices(familyId: string | null, childId: string) {
  return useQuery({
    queryKey: deviceKeys.child(familyId, childId),
    queryFn: familyId ? () => fetchChildDevices(familyId, childId) : skipToken,
  });
}

/** Сколько ещё действует код, мс; истёк — 0. */
const codeLeft = (code: ConnectCode | undefined) =>
  code ? Math.max(new Date(code.expiresAt).getTime() - Date.now(), 0) : 0;

/**
 * Код подключения устройства ребёнка. Запрашиваем, только пока меню кода
 * открыто (`enabled`). Код не запоминаем: каждое открытие меню спрашивает
 * сервер — пока код не истёк и не использован, он отдаёт тот же (таймер
 * продолжается), иначе новый. Иначе после подключения устройства показали
 * бы погашенный код. Пока меню открыто, код сам не меняется: истёк —
 * «Code expired» и New code (тот же запрос, сервер выдаст новый).
 * `familyId` — null у моковых детей: код из mockServer.
 */
export function useConnectCode(
  familyId: string | null,
  childId: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: deviceKeys.connectCode(childId),
    queryFn: enabled ? () => fetchConnectCode(familyId, childId) : skipToken,
    staleTime: (query) => codeLeft(query.state.data),
    // Меню закрыли — код забываем, следующее открытие спросит сервер.
    gcTime: 0,
    // Не вышло — сразу показываем ошибку и «Try again», а не ждём повторов.
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Чей код подключения (вход ребёнка). `code` — введённый целиком код, иначе
 * null и запроса нет. Ответ по коду держим, пока экран открыт: повторно тот
 * же код не спрашиваем.
 */
export function usePairingPreview(code: string | null) {
  return useQuery({
    queryKey: deviceKeys.preview(code ?? ''),
    queryFn: code ? () => previewPairing(code) : skipToken,
    staleTime: Infinity,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
