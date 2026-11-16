import type { TaskScope } from "../api/taskList.types";
import { useOngoingTasksQuery } from "../hooks/useOngoingTasksQuery";
import { TaskListView } from "./TaskListView";

export function MyTasksScreen({
  initialScope = "personal",
}: {
  initialScope?: TaskScope;
}) {
  const { tasks, isError } = useOngoingTasksQuery();

  return (
    <TaskListView
      key={initialScope}
      title="내 과제"
      status="ongoing"
      tasks={tasks}
      isError={isError}
      initialScope={initialScope}
    />
  );
}
