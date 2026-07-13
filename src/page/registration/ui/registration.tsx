import { View } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@app/components/ui/card';
import { Label } from '@app/components/ui/label';
import { Text } from '@app/components/ui/text';
import { Icon } from '@shared/ui/icons/icon';
import { Button } from '@app/components';
import { styles } from './registration.styled';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme/theme';
import { InputWithIcon } from '@app/components/ui/Input-with-icon/InputWithIcon';

export function Registration() {
  //TODO убрать Tailwind, вынести в css
  return (
    <Card style={styles.base}>
      <CardHeader style={styles.header}>
        <LinearGradient
          colors={[theme.colors.primeViolet, theme.colors.primeBlue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerIcon}
        >
          <Icon name="star" size={44} color={theme.colors.primarYellow} />
        </LinearGradient>
        <Text variant={'h1'}>Welcome to Kids Tascks</Text>
        <CardDescription style={styles.titleDescription}>
          Turn everyday chores into fun rewards for the whole family.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="w-full justify-center gap-4">
          <View className="gap-2">
            <Label htmlFor="Full Name" style={styles.inputName}>
              Full Name
            </Label>
            <InputWithIcon id="name" placeholder="Full Name" iconName="user" />
          </View>
          <View className="gap-2">
            <Label htmlFor="Email" style={styles.inputName}>
              Email
            </Label>
            <InputWithIcon id="email" placeholder="Email" iconName="message" />
          </View>
          <View className="gap-2">
            <Label htmlFor="Password" style={styles.inputName}>
              Email
            </Label>
            <InputWithIcon
              secureTextEntry={true}
              id="password"
              placeholder="Password"
              iconName="castle"
            />
          </View>
        </View>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <LinearGradient
          colors={[theme.colors.primeViolet, theme.colors.primeBlue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: `100%`,
            borderRadius: 30,
            overflow: 'hidden',
          }}
        >
          <Button variant="void" size={'default'}>
            <Text>Subscribe</Text>
          </Button>
        </LinearGradient>
      </CardFooter>
    </Card>
  );
}
