import { MapWeb } from '@widgets/map';
import { TabScreen } from '@widgets/bottom-nav';

export function MapPage() {
  return (
    <TabScreen activeKey="map" wide>
      <MapWeb />
    </TabScreen>
  );
}
