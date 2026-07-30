import { Pressable, Text, View } from "react-native";

import { CheckCircle, Task } from "@/components/icons";
import { cn } from "@/lib/utils";

/** 폴더 색상. Figma `sub` 컬러 토큰과 1:1로 대응한다. */
export type FolderColor =
  "sub-01" | "sub-02" | "sub-03" | "sub-04" | "sub-05" | "sub-null";

const FOLDER_COLOR_CLASS: Record<FolderColor, string> = {
  "sub-01": "bg-sub-01",
  "sub-02": "bg-sub-02",
  "sub-03": "bg-sub-03",
  "sub-04": "bg-sub-04",
  "sub-05": "bg-sub-05",
  "sub-null": "bg-sub-null",
};

/** `all` 항목의 라벨. Figma에 고정 문구로 박혀 있어 prop으로 열지 않는다. */
const ALL_LABEL = "모든 과제";

type FolderFilterItemBase = {
  /** 선택 여부. `true`면 오른쪽에 체크 아이콘이 붙는다. (기본값: `false`) */
  selected?: boolean;
  /** 항목을 탭했을 때 */
  onPress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * Figma `(mobile) 폴더필터링`의 `Property 1` variant를
 * `type`(폴더 / 모든 과제) × `selected`(선택 여부) 두 축으로 나눈 props.
 *
 * `all`은 폴더 색상 점 대신 과제 아이콘과 고정 라벨을 쓰므로
 * `name` / `color`를 넘길 수 없도록 타입 레벨에서 막는다.
 */
export type FolderFilterItemProps = FolderFilterItemBase &
  (
    | {
        type: "folder";
        /** 폴더 이름 (예: `폴더 1`) */
        name: string;
        /** 폴더 색상 점의 색. (기본값: `sub-null`) */
        color?: FolderColor;
      }
    | { type: "all"; name?: never; color?: never }
  );

/**
 * 폴더 필터 목록의 한 줄.
 *
 * `type="folder"`면 폴더 색상 점 + 폴더 이름을, `type="all"`이면 과제 아이콘 + `모든 과제`를 렌더링한다.
 * 너비는 지정하지 않으므로(Figma 106px) 부모에서 제어한다.
 */
export function FolderFilterItem(props: FolderFilterItemProps) {
  const { selected = false, onPress, className } = props;

  const label = props.type === "all" ? ALL_LABEL : props.name;
  const leading =
    props.type === "all" ? (
      <Task variant="xs" />
    ) : (
      <View
        className={cn(
          // Figma 폴더 색상 점: 12px 원
          "h-3 w-3 rounded-full",
          FOLDER_COLOR_CLASS[props.color ?? "sub-null"]
        )}
      />
    );

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={cn(
        "h-8 flex-row items-center justify-between gap-2 bg-gray-0 p-2",
        // Figma `모든과제` variant는 폴더 목록과 구분되는 아래 구분선을 갖는다.
        props.type === "all" && "border-b border-gray-100",
        className
      )}
    >
      <View className="flex-1 flex-row items-center gap-1">
        {leading}
        <Text numberOfLines={1} className="flex-1 text-gray-700 text-caption">
          {label}
        </Text>
      </View>

      {selected ? <CheckCircle variant="sm" /> : null}
    </Pressable>
  );
}
