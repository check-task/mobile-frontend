import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlarmItem } from "@/components/common/AlarmItem/AlarmItem";
import { Button } from "@/components/common/Button/Button";
import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { LogoHeader } from "@/components/common/Header/LogoHeader";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";

import type { AlarmDto } from "../api/alarm.types";
import { useAlarmMutations } from "../hooks/useAlarmMutations";
import { useAlarmsQuery } from "../hooks/useAlarmsQuery";

const CONTENT_BOTTOM_OFFSET = 24;
// 바닥에서 이만큼 남았을 때 다음 페이지를 불러온다.
const LOAD_MORE_THRESHOLD = 200;

export function NotificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const {
    data: alarms = [],
    isPending,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAlarmsQuery();
  const { readAll, remove, removeAll } = useAlarmMutations();
  const { mutate: markAllRead } = readAll;
  const didMarkReadRef = useRef(false);

  // 웹과 같이 알림 화면에 들어오면 모두 읽음 처리한다.
  useEffect(() => {
    if (didMarkReadRef.current) {
      return;
    }
    didMarkReadRef.current = true;
    markAllRead();
  }, [markAllRead]);

  const showError = (fallback: string) => (error: unknown) =>
    showToast("fail", getErrorMessage(error, fallback));

  const openAlarm = (alarm: AlarmDto) => {
    router.push({
      pathname:
        alarm.taskType === "TEAM"
          ? "/tasks/team/[taskId]"
          : "/tasks/personal/[taskId]",
      params: { taskId: String(alarm.taskId) },
    });
  };

  const loadMoreNearBottom = ({
    nativeEvent: { layoutMeasurement, contentOffset, contentSize },
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const isNearBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - LOAD_MORE_THRESHOLD;
    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const openClearAllModal = () => {
    openModal({
      title: "알림 삭제",
      children: (
        <DeleteConfirmModalContent
          heading="모든 알림을 삭제하시겠습니까?"
          description="삭제된 알림은 영구 삭제되며, 복구할 수 없습니다."
          onConfirm={() => {
            closeModal();
            removeAll.mutate(undefined, {
              onError: showError("알림을 삭제하지 못했어요."),
            });
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  return (
    <View className="flex-1 bg-gray-0" style={{ paddingTop: insets.top }}>
      <LogoHeader onMenuPress={() => router.navigate("/menu")} />
      <ScrollView
        onScroll={loadMoreNearBottom}
        scrollEventThrottle={100}
        contentContainerClassName="gap-4 px-4 pt-5"
        contentContainerStyle={{
          paddingBottom: insets.bottom + CONTENT_BOTTOM_OFFSET,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 text-h-02">알림</Text>
          {/*Figma는 테두리가 프레임 안쪽이라 pb 2px 안에 1px 선이 포함된다. RN은 선이 크기에 더해지므로 pb 1px + 선 1px로 맞춘다.*/}
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={openClearAllModal}
            className="border-b border-gray-400 pb-px"
          >
            <Text className="text-gray-400 text-b-04-r">모두 지우기</Text>
          </Pressable>
        </View>
        {isError ? (
          <View className="items-center gap-4 pt-10">
            <Text className="text-gray-600 text-b-02-r">
              알림을 불러오지 못했어요.
            </Text>
            <Button
              label="다시 시도"
              variant="gray"
              size="sm"
              className="w-auto"
              onPress={() => refetch()}
            />
          </View>
        ) : !isPending && alarms.length === 0 ? (
          <Text className="pt-10 text-center text-gray-400 text-b-02-r">
            새로운 알림이 없어요.
          </Text>
        ) : (
          <View className="gap-3">
            {alarms.map((alarm) => (
              <AlarmItem
                key={alarm.alarmId}
                title={alarm.title}
                description={alarm.alarmContent}
                status={alarm.isRead ? "read" : "new"}
                onPress={() => openAlarm(alarm)}
                onDismiss={() =>
                  remove.mutate(alarm.alarmId, {
                    onError: showError("알림을 삭제하지 못했어요."),
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
