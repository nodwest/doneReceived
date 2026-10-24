import { Text, View } from 'react-native';
import type { InviteCodes } from '@entities/family';
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
  return (
    <View style={styles.panel}>
      <View style={styles.head}>
        <Text style={styles.title}>Add family member</Text>
        <RoundButton
          size="sm"
          icon="close"
          accessibilityLabel="Close"
          onPress={onClose}
        />
      </View>
      <Text style={styles.hint}>
        Share a code with the new member. They enter it when signing up in Kids
        Tasks — and join your family right away.
      </Text>
      {codes && (
        <>
          <InviteCodeCard
            role="parent"
            title="For a parent"
            hint="Can create tasks, approve them and pay rewards."
            code={codes.parent}
          />
          <InviteCodeCard
            role="child"
            title="For a child"
            hint="Sees own tasks, marks them done and earns rewards."
            code={codes.child}
          />
        </>
      )}
    </View>
  );
}
