import { View } from 'react-native';
import { MapPage } from '@pages/map';
import { Registration } from '@pages/registration';
import { Providers } from './providers';
import './styles/app.css';

export default function App() {
  return (
    <Providers>
      <View>
        <Registration />
      </View>
      <MapPage />
    </Providers>
  );
}
