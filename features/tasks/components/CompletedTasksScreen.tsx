import { useCompletedTasksQuery } from "../hooks/useCompletedTasksQuery";
import { TaskListView } from "./TaskListView";

export function CompletedTasksScreen() {
  const { tasks, isError } = useCompletedTasksQuery();

  return (
    <TaskListView
      title="완료 과제"
      status="completed"
      tasks={tasks}
      isError={isError}
    />
  );
}
