import { TaskShortView } from '@widgets/task-short-view';
import './app.css';

export default function App() {
  return (
    <TaskShortView
      id={0}
      taskName={''}
      taskDescription={''}
      taskPenalty={0}
      taskAward={0}
    />
  );
}
