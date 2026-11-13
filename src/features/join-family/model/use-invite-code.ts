import { useState } from 'react';
import {
  formatInviteCode,
  isCompleteInviteCode,
  useFamilyInvitePreview,
  type InviteRole,
} from '@entities/family';

/**
 * typing — код ещё не введён целиком; checking — ищем семью; found — семья
 * найдена; not-found — код неверен, истёк или уже использован.
 */
export type InviteCodeStatus = 'typing' | 'checking' | 'found' | 'not-found';

/** Найденная по коду семья: название, кем войдём и кто в ней уже есть. */
export type FoundInvite = {
  familyName: string;
  role: InviteRole;
  members: string[];
};

export type InviteCodeState = {
  code: string;
  setCode: (input: string) => void;
  status: InviteCodeStatus;
  /** Найденная семья — только когда status === 'found'. */
  invite: FoundInvite | null;
};

/**
 * Ввод кода второго родителя: приводит ввод к виду `XXXX-XXXX` и, когда
 * введены все символы, спрашивает сервер, в какую семью он ведёт (GET
 * /families/invites/:code, код не гасится). Вступить можно только родителем.
 */
export function useInviteCode(): InviteCodeState {
  const [code, setCodeState] = useState('');
  const complete = isCompleteInviteCode(code);
  const { data, isPending, isError } = useFamilyInvitePreview(
    complete ? code : null,
  );

  let status: InviteCodeStatus;
  if (!complete) status = 'typing';
  else if (isError) status = 'not-found';
  else if (isPending || !data) status = 'checking';
  else status = 'found';

  return {
    code,
    setCode: (input) => setCodeState(formatInviteCode(input)),
    status,
    invite:
      status === 'found' && data
        ? {
            familyName: data.familyName,
            role: 'parent',
            members: data.members.map((member) => member.displayName),
          }
        : null,
  };
}
