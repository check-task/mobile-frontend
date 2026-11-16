import { Text, View } from "react-native";

import { AlarmHourSelect } from "./AlarmHourSelect";
import { SettingsCard } from "./SettingsCard";

type AlarmSettingsCardProps = {
  deadlineAlarm: number;
  taskAlarm: number;
  onDeadlineAlarmChange: (hours: number) => void;
  onTaskAlarmChange: (hours: number) => void;
};

export function AlarmSettingsCard({
  deadlineAlarm,
  taskAlarm,
  onDeadlineAlarmChange,
  onTaskAlarmChange,
}: AlarmSettingsCardProps) {
  return (
    <SettingsCard className="gap-5">
      <Text className="text-gray-900 text-b-01-m">알림 설정</Text>
      <View className="gap-3">
        <AlarmHourSelect
          label="최종 마감 알림"
          value={deadlineAlarm}
          onChange={onDeadlineAlarmChange}
        />
        <View className="h-px bg-gray-100" />
        <AlarmHourSelect
          label="TASK별 알림"
          value={taskAlarm}
          onChange={onTaskAlarmChange}
        />
      </View>
    </SettingsCard>
  );
}
