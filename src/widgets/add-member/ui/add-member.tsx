import { useState } from 'react';
import { View } from 'react-native';
import { JoinFamilyPanel } from '@features/join-family';
import type { InviteCodes } from '@entities/family';
import { useTranslation } from '@shared/i18n';
import { GradientButton } from '@shared/ui';
import { InviteCodesPanel } from './invite-codes-panel';
import { styles } from './add-member.styled';

type AddMemberProps = {
  /** Коды приглашения; пока грузятся — панель без карточек кодов. */
  codes?: InviteCodes;
};

/**
 * Кнопки «+ Family member» и Join family в один ряд. По нажатию на их месте
 * открывается панель: коды для второго родителя и ребёнка или ввод кода,
 * чтобы вступить в другую семью. Крестик возвращает кнопки.
 */
export function AddMember({ codes }: AddMemberProps) {
  const { t } = useTranslation();
  const [panel, setPanel] = useState<'codes' | 'join' | null>(null);
  const close = () => setPanel(null);

  if (panel === 'codes')
    return <InviteCodesPanel codes={codes} onClose={close} />;
  if (panel === 'join') return <JoinFamilyPanel onClose={close} />;

  return (
    <View style={styles.row}>
      <View style={styles.cell}>
        <GradientButton
          compact
          label={t('family.addMember')}
          icon="plus"
          onPress={() => setPanel('codes')}
        />
      </View>
      <View style={styles.cell}>
        <GradientButton
          compact
          label={t('family.joinFamily')}
          icon="children"
          onPress={() => setPanel('join')}
        />
      </View>
    </View>
  );
}
