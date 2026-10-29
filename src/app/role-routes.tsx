import { ChildHomePage } from '@pages/child-home';
import { MyTasksPage } from '@pages/my-tasks';
import { ParentHomePage } from '@pages/parent-home';
import {
  ChildRewardsHistoryPage,
  RewardsHistoryPage,
} from '@pages/rewards-history';
import { TasksPage } from '@pages/tasks';
import { ChildWalletPage, WalletPage } from '@pages/wallet';
import { useViewerRole } from '@entities/user';

/**
 * ВРЕМЕННО: вкладки, у которых свой экран для ребёнка. Роль переключается
 * тоглом Child mode в профиле; когда появится вход ребёнка, роль будет
 * браться из сессии.
 */
export function HomeRoute() {
  return useViewerRole() === 'child' ? <ChildHomePage /> : <ParentHomePage />;
}

export function TasksRoute() {
  return useViewerRole() === 'child' ? <MyTasksPage /> : <TasksPage />;
}

export function WalletRoute() {
  return useViewerRole() === 'child' ? <ChildWalletPage /> : <WalletPage />;
}

export function RewardsHistoryRoute() {
  return useViewerRole() === 'child' ? (
    <ChildRewardsHistoryPage />
  ) : (
    <RewardsHistoryPage />
  );
}
