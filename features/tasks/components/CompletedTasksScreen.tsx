import { COMPLETED_TASKS } from "./taskListData";
import { TaskListView } from "./TaskListView";

export function CompletedTasksScreen() {
  return (
    <TaskListView
      title="완료 과제"
      status="completed"
      tasks={COMPLETED_TASKS}
    />
  );
}
