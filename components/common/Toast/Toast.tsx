import type { ReactElement } from "react";
import { Text, View } from "react-native";

import { CancelFill, CheckCircleFill } from "@/components/icons";
import { cn } from "@/lib/utils";

/** 토스트 종류. 성공/실패에 따라 앞에 붙는 아이콘만 달라진다. */
export type ToastType = "success" | "fail";

/**
 * Figma 토스트의 아이콘 슬롯은 20px 고정이고 그 안에 아이콘이 들어간다.
 * 종류가 바뀌어도 메시지 위치가 흔들리지 않도록 슬롯 크기를 고정한다.
 */
const TOAST_ICON: Record<ToastType, ReactElement> = {
  success: <CheckCircleFill variant="sm" className="text-primary" />,
  fail: <CancelFill variant="sm" className="text-sub-01" />,
};

export type ToastProps = {
  /** 토스트 종류 */
  type: ToastType;
  /** 표시할 메시지 (예: `마감일 이전 날짜로 설정할 수 없습니다.`) */
  message: string;
  /** 바깥 여백 등 레이아웃 보정용. 위치(상단/하단 고정 등)는 부모가 결정한다. */
  className?: string;
};

/**
 * 화면에 잠깐 떠 있는 알림 토스트.
 *
 * 내용에 맞춰 너비가 줄어드는(hug) 알약 형태라 기본으로 `self-center` 정렬만 갖는다.
 * 노출/사라짐 타이밍과 화면상 위치는 호출부가 제어한다.
 */
export function Toast({ type, message, className }: ToastProps) {
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className={cn(
        "flex-row items-center justify-center gap-1 self-center rounded-full bg-blue-50 px-3 py-2",
        className
      )}
    >
      <View className="h-5 w-5 items-center justify-center">
        {TOAST_ICON[type]}
      </View>
      <Text className="shrink text-blue-700 text-b-04-r">{message}</Text>
    </View>
  );
}
