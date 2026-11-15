import { useLocalSearchParams } from "expo-router";

import { TeamTaskDetailScreen } from "@/features/tasks/components/TeamTaskDetailScreen";

export default function TeamTaskDetailRoute() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();

  return <TeamTaskDetailScreen taskId={Number(taskId)} />;
}
