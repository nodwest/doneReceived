import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import { formatBalance, useChildBalance } from '@entities/wallet';
import { styles } from './child-balance.styled';

type ChildBalanceProps = {
  childId: number;
  name: string;
  avatar: ImageSourcePropType;
};

/** Плитка баланса ребёнка: аватар, имя и сумма из его кошелька. */
export function ChildBalance({ childId, name, avatar }: ChildBalanceProps) {
  const { balance } = useChildBalance(childId);
  return (
    <View style={styles.card}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.balance}>{formatBalance(balance)}</Text>
      </View>
    </View>
  );
}
