import { Image, Text, View, type ImageSourcePropType } from 'react-native';
import { formatBalance } from '@entities/wallet';
import { styles } from './child-balance.styled';

type ChildBalanceProps = {
  name: string;
  avatar: ImageSourcePropType;
  balance: number;
};

/** Плитка баланса ребёнка: аватар, имя и сумма. */
export function ChildBalance({ name, avatar, balance }: ChildBalanceProps) {
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
