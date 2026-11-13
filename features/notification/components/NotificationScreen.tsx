import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlarmItem } from "@/components/common/AlarmItem/AlarmItem";
import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { LogoHeader } from "@/components/common/Header/LogoHeader";
import { useModal } from "@/hooks/useModal";

import { NOTIFICATIONS } from "./notifications";

const CONTENT_BOTTOM_OFFSET = 24;

export function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModal();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const dismissNotification = (id: string) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  };

  const openClearAllModal = () => {
    openModal({
      title: "알림 삭제",
      children: (
        <DeleteConfirmModalContent
          heading="모든 알림을 삭제하시겠습니까?"
          description="삭제된 알림은 영구 삭제되며, 복구할 수 없습니다."
          onConfirm={() => {
            setNotifications([]);
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  return (
    <View className="flex-1 bg-gray-0" style={{ paddingTop: insets.top }}>
      {/*메뉴 화면이 추가되면 onMenuPress 연결하기 (연결 전에는 메뉴 아이콘이 보이지 않음)*/}
      <LogoHeader />
      <ScrollView
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
        <View className="gap-3">
          {notifications.map((notification) => (
            <AlarmItem
              key={notification.id}
              title={notification.title}
              description={notification.description}
              status={notification.status}
              onDismiss={() => dismissNotification(notification.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
