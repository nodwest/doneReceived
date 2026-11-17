import { useChildLocationSharingSync } from '../model/use-child-location-sharing';

/**
 * Один фоновый синхронизатор на приложение: живёт в Providers, а не на
 * экране карты, чтобы шаринг продолжался при навигации и в фоне.
 */
export function ChildLocationSharingSync() {
  useChildLocationSharingSync();
  return null;
}
