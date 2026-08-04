import type { ReactElement, ReactNode } from "react";
import {
  Modal as ReactNativeModal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Cancel, CheckCircle } from "@/components/icons";
import { cn } from "@/lib/utils";

export type ModalHeaderIcon = "cancel" | "check";

const HEADER_ICON: Record<ModalHeaderIcon, ReactElement> = {
  cancel: <Cancel variant="lg" className="text-gray-900" />,
  check: <CheckCircle variant="lg" className="text-gray-900" />,
};

const HEADER_ICON_LABEL: Record<ModalHeaderIcon, string> = {
  cancel: "닫기",
  check: "완료",
};

export type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  headerIcon?: ModalHeaderIcon;
  onHeaderIconPress?: () => void;
  className?: string;
};

export function Modal({
  title,
  children,
  onClose,
  headerIcon,
  onHeaderIconPress,
  className,
}: ModalProps) {
  const handleHeaderIconPress = onHeaderIconPress ?? onClose;

  return (
    <ReactNativeModal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-gray-900/40">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="모달 닫기"
          onPress={onClose}
          className="absolute inset-0"
        />

        <View
          className={cn(
            "max-h-[80%] w-full max-w-[358px] overflow-hidden rounded-[12px] bg-bg px-4",
            className
          )}
        >
          <View className="border-b border-gray-200 pb-3 pt-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-900 text-b-01-m">{title}</Text>
              {headerIcon ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={HEADER_ICON_LABEL[headerIcon]}
                  onPress={handleHeaderIconPress}
                  hitSlop={8}
                  className="size-6 items-center justify-center"
                >
                  {HEADER_ICON[headerIcon]}
                </Pressable>
              ) : null}
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View>{children}</View>
          </ScrollView>
        </View>
      </View>
    </ReactNativeModal>
  );
}
