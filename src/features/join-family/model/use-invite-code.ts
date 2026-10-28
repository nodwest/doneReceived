import { useState } from 'react';
import {
  formatInviteCode,
  isCompleteInviteCode,
  useFamilyInvite,
  type FamilyInvite,
  type InviteRole,
} from '@entities/family';

/**
 * typing — код ещё не введён целиком; checking — ищем семью; found — семья
 * найдена и код даёт нужную роль; not-found — кода нет; wrong-role — код для
 * другой роли (родительский код в карточке ребёнка и наоборот).
 */
export type InviteCodeStatus =
  | 'typing'
  | 'checking'
  | 'found'
  | 'not-found'
  | 'wrong-role';

export type InviteCodeState = {
  code: string;
  setCode: (input: string) => void;
  status: InviteCodeStatus;
  /** Найденная семья — только когда status === 'found'. */
  invite: FamilyInvite | null;
  /** Роль, которую ждёт экран. */
  role: InviteRole;
};

/**
 * Ввод кода приглашения: приводит ввод к виду кода и, когда введены все
 * символы, ищет семью. `role` — кем человек входит: родитель на вкладке
 * Family и в профиле, ребёнок на выборе роли.
 */
export function useInviteCode(role: InviteRole): InviteCodeState {
  const [code, setCodeState] = useState('');
  const complete = isCompleteInviteCode(code);
  const { data, isPending } = useFamilyInvite(complete ? code : null);

  let status: InviteCodeStatus;
  if (!complete) status = 'typing';
  else if (isPending) status = 'checking';
  else if (!data) status = 'not-found';
  else if (data.role !== role) status = 'wrong-role';
  else status = 'found';

  return {
    code,
    setCode: (input) => setCodeState(formatInviteCode(input)),
    status,
    invite: status === 'found' ? (data ?? null) : null,
    role,
  };
}
