import { type ComponentRef, useRef } from "react";
import { Pressable, Text, View } from "react-native";

import { Input } from "@/components/common/Input/Input";
import { Menu } from "@/components/icons";
import { cn } from "@/lib/utils";

import type { AnchorRect } from "./MenuPopover";

export type TaskAssignee = {
  id: string;
  name: string;
};

export type TaskComment = {
  id: string;
  author: string;
  date: string;
  time: string;
  body: string;
};

export type TeamSubTaskDetailProps = {
  /** 담당자 목록 */
  assignees: readonly TaskAssignee[];
  /** 목록에 다 못 그린 담당자 수. 0이면 `외 N`을 그리지 않는다. */
  extraAssigneeCount: number;
  /** 댓글 목록 */
  comments: readonly TaskComment[];
  /** 입력 중인 댓글 */
  commentDraft: string;
  /** 댓글 입력이 바뀔 때 */
  onChangeCommentDraft: (text: string) => void;
  /** 전송 아이콘을 눌렀을 때 */
  onSendComment: () => void;
  /** 댓글 더보기 아이콘을 눌렀을 때. 메뉴를 붙일 수 있게 아이콘의 화면 좌표를 넘긴다. */
  onCommentMenuPress?: (id: string, anchor: AnchorRect) => void;
  /** `TASK 담당` 줄을 눌렀을 때. 메뉴를 붙일 수 있게 줄의 화면 좌표를 넘긴다. */
  onAssigneePress?: (anchor: AnchorRect) => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function TeamSubTaskDetail({
  assignees,
  extraAssigneeCount,
  comments,
  commentDraft,
  onChangeCommentDraft,
  onSendComment,
  onCommentMenuPress,
  onAssigneePress,
  className,
}: TeamSubTaskDetailProps) {
  const assigneeRowRef = useRef<ComponentRef<typeof View>>(null);
  return (
    <View className={cn("gap-3 pl-7", className)}>
      <Pressable
        ref={assigneeRowRef}
        accessibilityRole={onAssigneePress ? "button" : undefined}
        accessibilityLabel="TASK 담당 설정"
        onPress={
          onAssigneePress
            ? () =>
                assigneeRowRef.current?.measureInWindow((x, y, width, height) =>
                  onAssigneePress({ x, y, width, height })
                )
            : undefined
        }
        className="flex-row items-center gap-1"
      >
        <Text className="text-gray-600 text-caption">TASK 담당:</Text>
        <View className="flex-1 flex-row items-center gap-1">
          <View className="flex-row items-center gap-0.5">
            {assignees.map((assignee) => (
              <View
                key={assignee.id}
                className="flex-row items-center gap-0.5 rounded-[40px] bg-blue-50 p-1"
              >
                <View className="h-4 w-4 rounded-full bg-blue-200" />
                <Text className="text-gray-800 text-caption">
                  {assignee.name}
                </Text>
              </View>
            ))}
          </View>
          {extraAssigneeCount > 0 ? (
            <Text className="text-blue-300 text-caption">{`외 ${extraAssigneeCount}`}</Text>
          ) : null}
        </View>
      </Pressable>

      <Input
        shape="comment"
        value={commentDraft}
        onChangeText={onChangeCommentDraft}
        placeholder="댓글추가"
        onSend={onSendComment}
      />

      <View className="gap-3">
        {comments.map((comment) => (
          <View key={comment.id} className="gap-1">
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-center gap-1">
                <View className="h-5 w-5 rounded-full bg-blue-100" />
                <Text className="text-gray-700 text-b-04-m">
                  {comment.author}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-20 flex-row items-center gap-1">
                  <Text className="text-gray-400 text-b-04-r">
                    {comment.date}
                  </Text>
                  <Text className="text-gray-400 text-b-04-r">
                    {comment.time}
                  </Text>
                </View>
                <CommentMenuButton
                  onPress={
                    onCommentMenuPress
                      ? (anchor) => onCommentMenuPress(comment.id, anchor)
                      : undefined
                  }
                />
              </View>
            </View>
            <Text className="pl-6 text-gray-700 text-b-04-r">
              {comment.body}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CommentMenuButton({
  onPress,
}: {
  onPress?: (anchor: AnchorRect) => void;
}) {
  const ref = useRef<ComponentRef<typeof View>>(null);

  return (
    <Pressable
      ref={ref}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel="댓글 메뉴"
      hitSlop={8}
      onPress={
        onPress
          ? () =>
              ref.current?.measureInWindow((x, y, width, height) =>
                onPress({ x, y, width, height })
              )
          : undefined
      }
    >
      <Menu className="text-gray-400" />
    </Pressable>
  );
}
