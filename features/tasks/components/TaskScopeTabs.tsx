import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils";

import type { TaskScope } from "./taskListData";

const SCOPE_LABEL: Record<TaskScope, string> = {
  personal: "개인과제",
  team: "팀과제",
};

const SCOPES: readonly TaskScope[] = ["personal", "team"];

type TaskScopeTabsProps = {
  value: TaskScope;
  counts: Record<TaskScope, number>;
  onChange: (scope: TaskScope) => void;
  className?: string;
};

// 개인과제/팀과제 탭 (과제 수 배지 포함)
export function TaskScopeTabs({
  value,
  counts,
  onChange,
  className,
}: TaskScopeTabsProps) {
  return (
    <View
      className={cn(
        // 390px 화면 기준 탭 너비 171px (피그마랑 동일)
        "flex-row gap-1 rounded bg-gray-100 px-1.5 py-1",
        className
      )}
    >
      {SCOPES.map((scope) => {
        const selected = scope === value;
        return (
          <Pressable
            key={scope}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(scope)}
            className={cn(
              "flex-1 flex-row items-center justify-center gap-1 rounded py-1",
              selected ? "bg-gray-0" : "bg-gray-100"
            )}
          >
            <Text
              className={
                selected
                  ? "text-gray-900 text-b-03-m"
                  : "text-gray-500 text-b-03-r"
              }
            >
              {SCOPE_LABEL[scope]}
            </Text>
            <View
              className={cn(
                "w-[18px] items-center justify-center rounded",
                selected ? "bg-blue-600" : "bg-gray-300"
              )}
            >
              <Text className="text-gray-0 text-b-04-r">{counts[scope]}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
