import { useLocalSearchParams } from "expo-router";

import { PersonalTaskDetailScreen } from "@/features/tasks/components/PersonalTaskDetailScreen";

export default function PersonalTaskDetailRoute() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();

  return <PersonalTaskDetailScreen taskId={Number(taskId)} />;
}
