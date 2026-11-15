import { useLocalSearchParams } from "expo-router";

import { MyTasksScreen } from "@/features/tasks/components/MyTasksScreen";

export default function TasksRoute() {
  const { scope } = useLocalSearchParams<{ scope?: string }>();

  return (
    <MyTasksScreen initialScope={scope === "team" ? "team" : "personal"} />
  );
}
