import { IconLayer } from '@deck.gl/layers';
import type { Bus } from '@entities/vehicle';
import { vehicleIcon } from './vehicle-icon';
export function createVehiclesLayer(vehicles: Bus[]) {
  return new IconLayer<Bus>({
    id: 'buses-vehicles',

    data: vehicles,

    getIcon: () => vehicleIcon,

    getPosition: (vehicle) => [vehicle.longitude, vehicle.latitude],

    billboard: false,
    getAngle: (vehicle) => -vehicle.bearing,
    getSize: 32,
    sizeUnits: 'pixels',
    sizeMinPixels: 20,
    sizeMaxPixels: 40,
    pickable: true,
  });
}
