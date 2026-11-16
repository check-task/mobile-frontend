import { useCompletedTasksQuery } from "../hooks/useCompletedTasksQuery";
import { TaskListView } from "./TaskListView";

export function CompletedTasksScreen() {
  const { tasks, isPending, isError } = useCompletedTasksQuery();

  return (
    <TaskListView
      title="완료 과제"
      status="completed"
      tasks={tasks}
      isPending={isPending}
      isError={isError}
      emptyMessage="완료한 과제가 없어요."
    />
  );
}
