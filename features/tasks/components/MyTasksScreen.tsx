import type { TaskScope } from "../api/taskList.types";
import { useOngoingTasksQuery } from "../hooks/useOngoingTasksQuery";
import { TaskListView } from "./TaskListView";

export function MyTasksScreen({
  initialScope = "personal",
}: {
  initialScope?: TaskScope;
}) {
  const { tasks, isPending, isError } = useOngoingTasksQuery();

  return (
    <TaskListView
      key={initialScope}
      title="내 과제"
      status="ongoing"
      tasks={tasks}
      isPending={isPending}
      isError={isError}
      emptyMessage="진행 중인 과제가 없어요."
      initialScope={initialScope}
    />
  );
}
