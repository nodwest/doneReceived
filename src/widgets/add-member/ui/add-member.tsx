import { useState } from 'react';
import type { InviteCodes } from '@entities/family';
import { useTranslation } from '@shared/i18n';
import { GradientButton } from '@shared/ui';
import { InviteCodesPanel } from './invite-codes-panel';

type AddMemberProps = {
  /** Коды приглашения; пока грузятся — панель без карточек кодов. */
  codes?: InviteCodes;
};

/**
 * Кнопка «+ Family member». По нажатию на её месте открывается панель с
 * кодами для второго родителя и для ребёнка, крестик возвращает кнопку.
 */
export function AddMember({ codes }: AddMemberProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <GradientButton
        label={t('family.addMember')}
        icon="plus"
        onPress={() => setOpen(true)}
      />
    );
  }

  return <InviteCodesPanel codes={codes} onClose={() => setOpen(false)} />;
}
