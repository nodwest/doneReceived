import { Text, View } from 'react-native';
import type { InviteCodes } from '@entities/family';
import { useTranslation } from '@shared/i18n';
import { RoundButton } from '@shared/ui';
import { InviteCodeCard } from './invite-code-card';
import { styles } from './invite-codes-panel.styled';

type InviteCodesPanelProps = {
  /** Коды приглашения; пока грузятся — панель без карточек кодов. */
  codes?: InviteCodes;
  onClose: () => void;
};

/**
 * Панель с кодами приглашения для второго родителя и для ребёнка. Общая для
 * вкладки Family (открывается кнопкой «+ Family member») и профиля (пункт
 * Family codes); крестик закрывает её.
 */
export function InviteCodesPanel({ codes, onClose }: InviteCodesPanelProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.panel}>
      <View style={styles.head}>
        <Text style={styles.title}>{t('inviteCodes.title')}</Text>
        <RoundButton
          size="sm"
          icon="close"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
        />
      </View>
      <Text style={styles.hint}>{t('inviteCodes.hint')}</Text>
      {codes && (
        <>
          <InviteCodeCard
            role="parent"
            title={t('inviteCodes.parent.title')}
            hint={t('inviteCodes.parent.hint')}
            code={codes.parent}
          />
          <InviteCodeCard
            role="child"
            title={t('inviteCodes.child.title')}
            hint={t('inviteCodes.child.hint')}
            code={codes.child}
          />
        </>
      )}
    </View>
  );
}
