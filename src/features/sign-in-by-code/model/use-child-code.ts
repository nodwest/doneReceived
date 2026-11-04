import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  formatConnectCode,
  isCompleteConnectCode,
  useConnectCodeOwner,
} from '@entities/device';

/** Ребёнок семьи, в чей аккаунт может вести код. */
export type CodeChild = {
  id: number;
  name: string;
  avatar?: ImageSourcePropType;
};

/** Аккаунт, в который войдёт ребёнок по введённому коду. */
export type ChildAccount = CodeChild & { familyName: string };

/**
 * typing — код ещё не введён целиком; checking — спрашиваем «сервер»;
 * found — код ведёт в аккаунт ребёнка; invalid — код истёк, использован или
 * неизвестен.
 */
export type ChildCodeStatus = 'typing' | 'checking' | 'found' | 'invalid';

export type ChildCodeState = {
  code: string;
  setCode: (input: string) => void;
  status: ChildCodeStatus;
  /** Найденный аккаунт — только когда status === 'found'. */
  account: ChildAccount | null;
};

/**
 * Ввод одноразового кода подключения на выборе роли: приводит ввод к виду
 * кода и, когда введены все символы, узнаёт, чей это аккаунт. `children` —
 * дети семьи, из них берём имя и фото (пока «сервер» отдаёт только id).
 */
export function useChildCode(children: readonly CodeChild[]): ChildCodeState {
  const [code, setCodeState] = useState('');
  const complete = isCompleteConnectCode(code);
  const { data, isPending } = useConnectCodeOwner(complete ? code : null);
  const child = data && children.find((item) => item.id === data.childId);

  let status: ChildCodeStatus;
  if (!complete) status = 'typing';
  else if (isPending) status = 'checking';
  else if (!data || !child) status = 'invalid';
  else status = 'found';

  return {
    code,
    setCode: (input) => setCodeState(formatConnectCode(input)),
    status,
    account:
      status === 'found' && data && child
        ? { ...child, familyName: data.familyName }
        : null,
  };
}
