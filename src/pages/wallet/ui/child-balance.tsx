import { Text, View, type ImageSourcePropType } from 'react-native';
import { formatMoney, useChildBalance } from '@entities/wallet';
import { LetterAvatar } from '@shared/ui';
import { styles } from './child-balance.styled';

type ChildBalanceProps = {
  /** Моковый — число строкой, с сервера — UUID (тогда нужна семья). */
  childId: string;
  familyId?: string | null;
  name: string;
  /** null — фото нет, буква имени. */
  avatar: ImageSourcePropType | null;
};

/** Плитка баланса ребёнка: аватар, имя и сумма из его кошелька. */
export function ChildBalance({
  childId,
  familyId = null,
  name,
  avatar,
}: ChildBalanceProps) {
  const { balance } = useChildBalance(childId, familyId);
  return (
    <View style={styles.card}>
      <LetterAvatar
        source={avatar}
        name={name}
        style={styles.avatar}
        letterSize={18}
      />
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.balance}>{formatMoney(balance)}</Text>
      </View>
    </View>
  );
}
