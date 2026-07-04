import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@app/components/ui/button';
import { Text } from '@app/components/ui/text';

export function TaskShortView() {
  return (
    <View style={styles.container}>
      <View>
        <Button>
          <Text>Button</Text>
        </Button>
        <Text>Ну и что?</Text>
        <StatusBar style="auto" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
