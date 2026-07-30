import { Pressable, Text, View } from "react-native";

import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";
import type { FolderColor } from "@/types/folder.types";

import { FolderColorDot } from "./FolderColorDot";

/** 과제 카드 종류. Figma `(mobile) assignment`의 `Property 1` variant와 대응한다. */
export type TaskCardType = "ing" | "history";

type TaskCardBase = {
  /** 과제가 속한 폴더 이름 (예: `폴더명`) */
  folderName: string;
  /** 폴더 색상 점의 색. (기본값: `sub-null`) */
  folderColor?: FolderColor;
  /** 과제 이름 (예: `과제명`) */
  title: string;
  /** 카드를 탭했을 때 */
  onPress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * `ing`(진행 중)은 오른쪽에 D-day 배지를, `history`(지난 과제)는 날짜 텍스트를 보여준다.
 * 서로 섞일 수 없으므로 타입 레벨에서 막는다.
 */
export type TaskCardProps = TaskCardBase &
  (
    | {
        type: "ing";
        /** 마감까지 남은 기간 라벨 (예: `D-3`). 포맷은 호출부가 정한다. */
        dday: string;
        date?: never;
      }
    | {
        type: "history";
        /** 완료/마감 날짜 라벨 (예: `2026.07.31`). 포맷은 호출부가 정한다. */
        date: string;
        dday?: never;
      }
  );

/**
 * 과제 목록에서 사용하는 공용 과제 카드.
 *
 * 너비는 지정하지 않으므로(Figma 358px = 화면 좌우 20px 여백) 부모에서 제어한다.
 */
export function TaskCard(props: TaskCardProps) {
  const { folderName, folderColor, title, onPress, className } = props;

  const trailing =
    props.type === "ing" ? (
      // Figma D-day 배지. 카드와 같은 gray-0 배경이지만 variant 정의를 그대로 따른다.
      <View className="rounded bg-gray-0 px-2 py-1">
        <Text className="text-sub-01 text-b-03-m">{props.dday}</Text>
      </View>
    ) : (
      <Text className="text-gray-400 text-b-04-r">{props.date}</Text>
    );

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      onPress={onPress}
      style={CARD_SHADOW}
      className={cn(
        "flex-row items-center justify-between gap-2 rounded-lg bg-gray-0 px-3 py-4",
        className
      )}
    >
      <View className="flex-1 gap-2">
        <View className="flex-row items-center gap-1">
          <FolderColorDot color={folderColor} />
          <Text numberOfLines={1} className="text-gray-600 text-b-04-r">
            {folderName}
          </Text>
        </View>
        <Text className="text-gray-900 text-b-02-m">{title}</Text>
      </View>

      {trailing}
    </Pressable>
  );
}
