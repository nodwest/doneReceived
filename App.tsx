import { TaskShortView } from '@widgets/task-short-view';
import './app.css';
import { MapWeb } from '@widgets/map/map.web';
import { Registration } from './src/page/registration';
import { View } from 'react-native';

export default function App() {
  return (
    <>
      <View>
        <Registration />
      </View>
      <MapWeb />
    </>
  );
}
