import { Text, View } from 'react-native';
import { RoleIcon, RoleTint, type FamilyRole } from '@entities/user';
import { CopyableCode } from '@shared/ui';
import { styles } from './invite-code-card.styled';

type InviteCodeCardProps = {
  role: FamilyRole;
  title: string;
  /** Что сможет новый участник с этой ролью. */
  hint: string;
  code: string;
};

/** Блок кода приглашения: иконка роли, подсказка и код с копированием. */
export function InviteCodeCard({
  role,
  title,
  hint,
  code,
}: InviteCodeCardProps) {
  return (
    <View style={styles.shadow}>
      <RoleTint role={role} style={styles.card}>
        <View style={styles.top}>
          <RoleIcon role={role} />
          <View style={styles.texts}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.hint}>{hint}</Text>
          </View>
        </View>
        <CopyableCode code={code} />
      </RoleTint>
    </View>
  );
}
