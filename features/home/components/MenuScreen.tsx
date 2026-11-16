import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button/Button";
import {
  AlarmDefault,
  Bottom,
  Cancel,
  Home,
  Logout,
  Notice,
  Task,
  TaskHistory,
  Top,
  User,
} from "@/components/icons";
import { useSignOut } from "@/hooks/useSignOut";

export function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tasksOpen, setTasksOpen] = useState(false);
  const signOut = useSignOut();

  const items = [
    {
      label: "완료 과제 히스토리",
      icon: TaskHistory,
      onPress: () => router.navigate("/tasks/completed"),
    },
    {
      label: "내 정보",
      icon: User,
      onPress: () => router.navigate("/settings"),
    },
    {
      label: "공지사항",
      icon: Notice,
      onPress: () => router.navigate("/notice"),
    },
    {
      label: "알림",
      icon: AlarmDefault,
      onPress: () => router.navigate("/notification"),
    },
  ];

  return (
    <View
      className="flex-1 bg-gray-0"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 46 }}
    >
      <View className="h-14 items-end justify-center border-b border-gray-100 px-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="메뉴 닫기"
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Cancel variant="xl" className="text-gray-800" />
        </Pressable>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-4 pt-5"
      >
        <MenuRow label="홈" icon={Home} onPress={() => router.navigate("/")} />
        <View className="border-b border-blue-100 px-2 pb-[11px]">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: tasksOpen }}
            onPress={() => setTasksOpen((open) => !open)}
            className="h-6 flex-row items-center"
          >
            <Task variant="md" className="text-blue-600" />
            <Text className="ml-1 flex-1 text-blue-600 text-b-01-m">과제</Text>
            {tasksOpen ? (
              <Top variant="md" className="text-blue-600" />
            ) : (
              <Bottom variant="md" className="text-blue-600" />
            )}
          </Pressable>
          {tasksOpen ? (
            <View className="ml-6 mt-2">
              <Pressable
                accessibilityRole="button"
                onPress={() => router.navigate("/tasks?scope=personal")}
                className="h-[29px] border-b border-blue-100"
              >
                <Text className="text-blue-600 text-b-02-r">개인과제</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.navigate("/tasks?scope=team")}
                className="h-[29px] pt-2"
              >
                <Text className="text-blue-600 text-b-02-r">팀과제</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
        {items.map(({ label, icon, onPress }) => (
          <MenuRow key={label} label={label} icon={icon} onPress={onPress} />
        ))}
        {/* 피그마에 로그아웃 위치가 없어서 임시로 메뉴 맨 아래에 둔다 */}
        <MenuRow
          label="로그아웃"
          icon={Logout}
          onPress={signOut.isPending ? undefined : () => signOut.mutate()}
        />
      </ScrollView>
      <View className="gap-3 px-4">
        <Pressable
          disabled
          accessibilityState={{ disabled: true }}
          className="h-12 items-center justify-center rounded-lg bg-gray-100"
        >
          <Text className="text-gray-600 text-btn">팀 과제 참여</Text>
        </Pressable>
        <Button
          label="새 과제 생성"
          onPress={() => router.navigate("/tasks/create")}
        />
      </View>
    </View>
  );
}

type MenuRowProps = {
  label: string;
  icon: typeof Home;
  onPress?: () => void;
};

function MenuRow({ label, icon: Icon, onPress }: MenuRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={{ disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      className="h-9 flex-row items-center border-b border-blue-100 px-2 pb-[11px]"
    >
      <Icon variant="md" className="text-blue-600" />
      <Text className="ml-1 text-blue-600 text-b-01-m">{label}</Text>
    </Pressable>
  );
}
