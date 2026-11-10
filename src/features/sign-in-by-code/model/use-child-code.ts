import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  formatConnectCode,
  isCompleteConnectCode,
  usePairingPreview,
} from '@entities/device';
import { isApiError } from '@shared/api';

/** Аккаунт, в который войдёт ребёнок по введённому коду. */
export type ChildAccount = {
  id: string;
  name: string;
  avatar?: ImageSourcePropType;
  familyName: string;
};

/**
 * typing — код ещё не введён целиком; checking — спрашиваем сервер;
 * found — код ведёт в профиль ребёнка; invalid — код истёк, использован
 * или неизвестен; failed — сервер не ответил (сеть, лимит попыток).
 */
export type ChildCodeStatus =
  | 'typing'
  | 'checking'
  | 'found'
  | 'invalid'
  | 'failed';

export type ChildCodeState = {
  code: string;
  setCode: (input: string) => void;
  status: ChildCodeStatus;
  /** Найденный аккаунт — только когда status === 'found'. */
  account: ChildAccount | null;
};

/**
 * Ввод одноразового кода подключения на выборе роли: приводит ввод к виду
 * `XXXX-XXXX` и, когда введены все символы, спрашивает сервер, чей это
 * профиль (POST /child-devices/pair/preview). Код при этом не гасится.
 */
export function useChildCode(): ChildCodeState {
  const [code, setCodeState] = useState('');
  const complete = isCompleteConnectCode(code);
  const { data, error, isPending } = usePairingPreview(complete ? code : null);

  let status: ChildCodeStatus;
  if (!complete) status = 'typing';
  else if (data) status = 'found';
  else if (isPending) status = 'checking';
  else if (isApiError(error) && (error.status === 404 || error.status === 400))
    status = 'invalid';
  else status = 'failed';

  return {
    code,
    setCode: (input) => setCodeState(formatConnectCode(input)),
    status,
    account:
      status === 'found' && data
        ? {
            id: data.childId,
            name: data.name,
            avatar: data.avatarUrl ? { uri: data.avatarUrl } : undefined,
            familyName: data.familyName,
          }
        : null,
  };
}
