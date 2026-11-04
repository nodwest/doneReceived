import { useState } from 'react';
import { View } from 'react-native';
import { AddChildSheet } from '@features/add-child';
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
 * открывается панель: код для второго родителя и Add a child или ввод кода,
 * чтобы вступить в другую семью. Крестик возвращает кнопки. Add a child
 * открывает шторку New child; профиль создан — шторка и панель закрываются.
 */
export function AddMember({ codes }: AddMemberProps) {
  const [panel, setPanel] = useState<'codes' | 'join' | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const close = () => setPanel(null);

  return (
    <>
      {panel === 'codes' ? (
        <InviteCodesPanel
          codes={codes}
          onClose={close}
          onAddChild={() => setSheetOpen(true)}
        />
      ) : panel === 'join' ? (
        <JoinFamilyPanel onClose={close} />
      ) : (
        <Buttons onOpen={setPanel} />
      )}
      <AddChildSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreated={() => {
          setSheetOpen(false);
          close();
        }}
      />
    </>
  );
}

/** Две кнопки в ряд: «+ Family member» и Join family. */
function Buttons({ onOpen }: { onOpen: (panel: 'codes' | 'join') => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <View style={styles.cell}>
        <GradientButton
          compact
          label={t('family.addMember')}
          icon="plus"
          onPress={() => onOpen('codes')}
        />
      </View>
      <View style={styles.cell}>
        <GradientButton
          compact
          label={t('family.joinFamily')}
          icon="children"
          onPress={() => onOpen('join')}
        />
      </View>
    </View>
  );
}
