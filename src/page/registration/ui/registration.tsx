import { View } from 'react-native';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@app/components/ui/card';
import { Label } from '@app/components/ui/label';
import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { Text } from '@app/components/ui/text';

export function Registration() {
  return (
    <View>
      <Card className="">
        <CardHeader className="flex-row">
          <View className="flex-1 gap-1.5">
            <CardTitle>Subscribe to our newsletter</CardTitle>
            <CardDescription>
              Enter your details to receive updates and tips
            </CardDescription>
          </View>
        </CardHeader>
        <CardContent>
          <View className="w-full justify-center gap-4">
            <View className="gap-2">
              <Label htmlFor="Full Name">Email</Label>
              <Input id="email" placeholder="Sarah Johnson" />
            </View>
            <View className="gap-2">
              <Label htmlFor="Email">Name</Label>
              <Input id="name" placeholder="sarah@email.com" />
            </View>
            <View className="gap-2">
              <Label htmlFor="Password">Email</Label>
              <Input id="email" placeholder="Password" />
            </View>
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button className="w-full">
            <Text>Subscribe</Text>
          </Button>
          <Button variant="outline" className="w-full">
            <Text>Later</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
