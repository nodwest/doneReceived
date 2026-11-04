import { skipToken, useQuery } from '@tanstack/react-query';
import type { ConnectCode } from '../model/device';
import {
  fetchConnectCode,
  fetchConnectCodeOwner,
  fetchDevices,
} from './device-api';

/** Ключи кэша устройств. */
export const deviceKeys = {
  all: ['devices'] as const,
  list: () => [...deviceKeys.all, 'list'] as const,
  connectCode: (childId: number) =>
    [...deviceKeys.all, 'connect-code', childId] as const,
  codeOwner: (code: string) => [...deviceKeys.all, 'code-owner', code] as const,
};

/** Устройства всех детей семьи. */
export function useDevices() {
  return useQuery({ queryKey: deviceKeys.list(), queryFn: fetchDevices });
}

/** Сколько ещё действует код, мс; истёк — 0. */
const codeLeft = (code: ConnectCode | undefined) =>
  code ? Math.max(new Date(code.expiresAt).getTime() - Date.now(), 0) : 0;

/**
 * Код подключения устройства ребёнка. Запрашиваем, только пока меню кода
 * открыто (`enabled`). Живой код свежий до своего срока: открыли меню снова
 * в течение 15 минут — тот же код и таймер. Истёк — при следующем открытии
 * меню сервер выдаёт новый. Пока меню открыто, код сам не меняется: истёк —
 * «Code expired», новый — по New code.
 */
export function useConnectCode(childId: number, enabled: boolean) {
  return useQuery({
    queryKey: deviceKeys.connectCode(childId),
    queryFn: enabled ? () => fetchConnectCode(childId) : skipToken,
    staleTime: (query) => codeLeft(query.state.data),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

/**
 * Чей код подключения (вход ребёнка). `code` — введённый целиком код, иначе
 * null и запроса нет. Ответ не кэшируем надолго: код может истечь.
 */
export function useConnectCodeOwner(code: string | null) {
  return useQuery({
    queryKey: deviceKeys.codeOwner(code ?? ''),
    queryFn: code ? () => fetchConnectCodeOwner(code) : skipToken,
    staleTime: 0,
    gcTime: 0,
  });
}
