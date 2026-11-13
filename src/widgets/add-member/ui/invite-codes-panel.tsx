import { Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { GradientButton, RoundButton } from '@shared/ui';
import { InviteCodeCard } from './invite-code-card';
import { ParentInviteCode } from './parent-invite-code';
import { styles } from './invite-codes-panel.styled';

type InviteCodesPanelProps = {
  onClose: () => void;
  /**
   * Add a child: у ребёнка вместо кода — кнопка создать профиль (вкладка
   * Family). Без обработчика — код для ребёнка, как в профиле.
   */
  onAddChild?: () => void;
};

/**
 * Панель «Add family member». Общая для вкладки Family (кнопка «+ Family
 * member») и профиля (пункт Family codes); крестик закрывает её. У второго
 * родителя — код семьи; у ребёнка на Family — Add a child (профиль, потом
 * устройство одноразовым кодом), в профиле — код для ребёнка.
 */
export function InviteCodesPanel({
  onClose,
  onAddChild,
}: InviteCodesPanelProps) {
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
      <Text style={styles.hint}>
        {onAddChild ? t('inviteCodes.hintWithChild') : t('inviteCodes.hint')}
      </Text>
      <InviteCodeCard
        role="parent"
        title={t('inviteCodes.parent.title')}
        hint={t('inviteCodes.parent.hint')}
      >
        <ParentInviteCode />
      </InviteCodeCard>
      {onAddChild && (
        <InviteCodeCard
          role="child"
          title={t('inviteCodes.child.title')}
          hint={t('inviteCodes.child.createHint')}
          footnote={t('inviteCodes.newDeviceHint')}
        >
          <GradientButton
            compact
            small
            icon="plus"
            label={t('inviteCodes.addChild')}
            onPress={onAddChild}
          />
        </InviteCodeCard>
      )}
    </View>
  );
}
