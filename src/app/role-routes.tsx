import { ChildHomePage } from '@pages/child-home';
import { MyTasksPage } from '@pages/my-tasks';
import { ParentHomePage } from '@pages/parent-home';
import {
  ChildRewardsHistoryPage,
  RewardsHistoryPage,
} from '@pages/rewards-history';
import { TasksPage } from '@pages/tasks';
import { ChildTransactionsPage, TransactionsPage } from '@pages/transactions';
import { ChildWalletPage, WalletPage } from '@pages/wallet';
import { useViewerRole } from '@entities/user';

/**
 * Вкладки, у которых свой экран для ребёнка: роль берётся по `kind`
 * вошедшего аккаунта (`useViewerRole`).
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

export function TransactionsRoute() {
  return useViewerRole() === 'child' ? (
    <ChildTransactionsPage />
  ) : (
    <TransactionsPage />
  );
}
