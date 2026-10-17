import { TaskShortView } from '@widgets/task-short-view';
import './app.css';
import { MapWeb } from '@widgets/map/map.web';
import { Registration } from '@pages/registration';
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
