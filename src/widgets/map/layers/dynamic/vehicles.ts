import { IconLayer } from '@deck.gl/layers';
import type { BusesVehicle } from '@entities/vehicle';
import { vehicleIcon } from './vehicle-icon';
export function createVehiclesLayer(vehicles: BusesVehicle[]) {
  return new IconLayer<BusesVehicle>({
    id: 'buses-vehicles',

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
