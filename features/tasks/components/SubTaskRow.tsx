import { Pressable, Text, View } from "react-native";

import {
  Bottom,
  Calendar,
  CheckBox,
  Clock,
  ClockClose,
  Top,
} from "@/components/icons";
import { cn } from "@/lib/utils";

export type SubTask = {
  id: string;
  title: string;
  dueDate: string;
  done: boolean;
  alarm: boolean;
};

export type SubTaskRowProps = {
  /** 세부 TASK 이름 (예: `선행 연구 조사`) */
  title: string;
  /** 마감일 라벨 (예: `25.10.22`). 포맷은 호출부가 정한다. */
  dueDate: string;
  /** 완료 여부. 완료하면 글자와 아이콘이 흐려지고 취소선이 그어진다. */
  done: boolean;
  /** 알림 여부. 꺼져 있으면 빗금 친 알림 아이콘을 그린다. */
  alarm: boolean;
  /** 체크박스를 눌렀을 때 */
  onToggle?: () => void;
  /** 알림 아이콘을 눌렀을 때 */
  onAlarmPress?: () => void;
  /** 펼침 화살표를 눌렀을 때. 넘기면 행 오른쪽 끝에 화살표를 그린다. */
  onExpandPress?: () => void;
  /** 펼쳐진 상태 여부. 화살표 방향이 바뀐다. */
  expanded?: boolean;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function SubTaskRow({
  title,
  dueDate,
  done,
  alarm,
  onToggle,
  onAlarmPress,
  onExpandPress,
  expanded = false,
  className,
}: SubTaskRowProps) {
  const metaColorClass = done ? "text-gray-400" : "text-gray-600";

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <View className="flex-1 flex-row items-center gap-1">
        <Pressable
          accessibilityRole={onToggle ? "checkbox" : undefined}
          accessibilityState={{ checked: done }}
          hitSlop={8}
          onPress={onToggle}
          className="h-6 w-6 items-center justify-center"
        >
          {done ? (
            <CheckBox variant="lg" className="text-gray-400" />
          ) : (
            <View className="h-4 w-4 rounded-[1px] border border-gray-900" />
          )}
        </Pressable>
        <Text
          className={cn(
            "flex-1",
            done
              ? "text-gray-400 line-through text-b-04-r"
              : "text-gray-900 text-b-04-m"
          )}
        >
          {title}
        </Text>
      </View>

      <View className="flex-row items-center gap-1">
        <View className="w-20 flex-row items-center gap-1">
          <Calendar variant="lg" className={metaColorClass} />
          <Text className={cn(metaColorClass, "text-b-04-r")}>{dueDate}</Text>
        </View>
        <Pressable
          accessibilityRole={onAlarmPress ? "button" : undefined}
          accessibilityLabel={alarm ? "알림 끄기" : "알림 켜기"}
          hitSlop={8}
          onPress={onAlarmPress}
        >
          {alarm ? (
            <Clock
              variant="lg"
              className={done ? "text-gray-400" : "text-primary"}
            />
          ) : (
            <ClockClose
              variant="lg"
              className={done ? "text-gray-400" : "text-primary"}
            />
          )}
        </Pressable>
        {onExpandPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={expanded ? "접기" : "펼치기"}
            accessibilityState={{ expanded }}
            hitSlop={8}
            onPress={onExpandPress}
          >
            {expanded ? (
              <Top variant="lg" className="text-gray-600" />
            ) : (
              <Bottom variant="lg" className="text-gray-600" />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
