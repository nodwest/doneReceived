import { IconLayer } from '@deck.gl/layers';
import type { PikasVehicle } from '@entities/vehicle';
import { vehicleIcon } from './vehicle-icon';
export function createVehiclesLayer(vehicles: PikasVehicle[]) {
  return new IconLayer<PikasVehicle>({
    id: 'pikas-vehicles',

    data: vehicles,

    getIcon: () => vehicleIcon,

    getPosition: (vehicle) => [vehicle.longitude, vehicle.latitude],

    getAngle: (vehicle) => vehicle.bearing,
    getSize: 32,
    sizeUnits: 'pixels',
    sizeMinPixels: 20,
    sizeMaxPixels: 40,
    pickable: true,

    onClick: (info) => {
      if (!info.object) return;

      console.log('Vehicle clicked:', info.object);
    },
  });
}
