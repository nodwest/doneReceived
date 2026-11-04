import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { RoleIcon, RoleTint, type FamilyRole } from '@entities/user';
import { CopyableCode } from '@shared/ui';
import { styles } from './invite-code-card.styled';

type InviteCodeCardProps = {
  role: FamilyRole;
  title: string;
  /** Что сможет новый участник с этой ролью. */
  hint: string;
  /** Код с копированием; вместо него можно передать своё (`children`). */
  code?: string;
  children?: ReactNode;
  /** Мелкая подпись внизу блока. */
  footnote?: string;
};

/**
 * Блок роли в «Add family member»: иконка, подсказка и код с копированием
 * или своё действие (Add a child).
 */
export function InviteCodeCard({
  role,
  title,
  hint,
  code,
  children,
  footnote,
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
        {code !== undefined && <CopyableCode code={code} />}
        {children}
        {footnote && <Text style={styles.footnote}>{footnote}</Text>}
      </RoleTint>
    </View>
  );
}
