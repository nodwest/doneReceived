import { useState } from 'react';
import { Text, View } from 'react-native';
import type { InviteCodes } from '@entities/family';
import { GradientButton, RoundButton } from '@shared/ui';
import { InviteCodeCard } from './invite-code-card';
import { styles } from './add-member.styled';

type AddMemberProps = {
  /** Коды приглашения; пока грузятся — панель без карточек кодов. */
  codes?: InviteCodes;
};

/**
 * Кнопка «+ Family member». По нажатию на её месте открывается панель с
 * кодами для второго родителя и для ребёнка, крестик возвращает кнопку.
 */
export function AddMember({ codes }: AddMemberProps) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <GradientButton
        label="Family member"
        icon="plus"
        onPress={() => setOpen(true)}
      />
    );
  }

  return (
    <View style={styles.panel}>
      <View style={styles.head}>
        <Text style={styles.title}>Add family member</Text>
        <RoundButton
          size="sm"
          icon="close"
          accessibilityLabel="Close"
          onPress={() => setOpen(false)}
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
