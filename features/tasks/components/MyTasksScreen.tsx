import { ONGOING_TASKS, type TaskScope } from "./taskListData";
import { TaskListView } from "./TaskListView";

export function MyTasksScreen({
  initialScope = "personal",
}: {
  initialScope?: TaskScope;
}) {
  return (
    <TaskListView
      key={initialScope}
      title="내 과제"
      status="ongoing"
      tasks={ONGOING_TASKS}
      initialScope={initialScope}
    />
  );
}
