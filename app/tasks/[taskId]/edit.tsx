import { useLocalSearchParams } from "expo-router";

import { TaskEditScreen } from "@/features/tasks/components/TaskEditScreen";

export default function TaskEditRoute() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();

  return <TaskEditScreen taskId={taskId} />;
}
