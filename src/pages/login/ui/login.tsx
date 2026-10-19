import { ScrollView, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
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
import { styles } from './login.styled';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';

export function Login() {
  return (
    <TabScreen activeKey="family">
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
              <Icon name="lock" size={44} color={theme.colors.yellow} />
            </LinearGradient>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>
              Log in to keep turning everyday chores into fun rewards for the
              whole family.
            </Text>
          </CardHeader>
          <CardContent>
            <View style={styles.content}>
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
              <View
                style={[styles.field, styles.fieldSpacer]}
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Label htmlFor="name" style={styles.label}>
                  Full Name
                </Label>
                <InputWithIcon
                  editable={false}
                  placeholder="Full Name"
                  iconName="user"
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
                <Text style={styles.buttontitle}>Log In</Text>
              </Button>
            </LinearGradient>
          </CardFooter>
          <Text style={styles.subtitle}>
            Don&apos;t have an account yet?{' '}
            <Link href="/registration" style={styles.linktitle}>
              Sign up
            </Link>
          </Text>
        </Card>
      </ScrollView>
    </TabScreen>
  );
}
