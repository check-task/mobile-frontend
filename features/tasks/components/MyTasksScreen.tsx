import { ONGOING_TASKS } from "./taskListData";
import { TaskListView } from "./TaskListView";

export function MyTasksScreen() {
  return (
    <TaskListView title="내 과제" status="ongoing" tasks={ONGOING_TASKS} />
  );
}
