import { ScrollView, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Icon,
  InputWithIcon,
  Label,
} from '@shared/ui';
import { styles } from './registration.styled';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';

export function Registration() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.container}>
          <CardHeader style={styles.header}>
            <LinearGradient
              style={styles.iconWrapper}
              colors={[theme.colors.violet, theme.colors.blue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="star" size={44} color={theme.colors.yellow} />
            </LinearGradient>
            <Text style={styles.title}>Welcome to Kids Tasks</Text>
            <Text style={styles.subtitle}>
              Turn everyday chores into fun rewards for the whole family.
            </Text>
          </CardHeader>
          <CardContent>
            <View style={styles.content}>
              <View style={styles.field}>
                <Label htmlFor="name" style={styles.label}>
                  Full Name
                </Label>
                <InputWithIcon
                  id="name"
                  placeholder="Full Name"
                  iconName="user"
                />
              </View>
              <View style={styles.field}>
                <Label htmlFor="email" style={styles.label}>
                  Email
                </Label>
                <InputWithIcon
                  id="email"
                  placeholder="Email"
                  iconName="message"
                />
              </View>
              <View style={styles.field}>
                <Label htmlFor="password" style={styles.label}>
                  Password
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
          <CardFooter>
            <LinearGradient
              colors={[theme.colors.violet, theme.colors.blue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: `100%`,
                borderRadius: 30,
                overflow: 'hidden',
              }}
            >
              <Button variant="void" size={'default'}>
                <Text style={styles.buttontitle}>Create Account</Text>
              </Button>
            </LinearGradient>
          </CardFooter>
          <Text style={styles.subtitle}>
            Already have an account?{' '}
            <Link href="/login" style={styles.linktitle}>
              Log In
            </Link>
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
