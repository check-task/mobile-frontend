import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Fab } from "@/components/common/Fab/Fab";
import { LogoHeader } from "@/components/common/Header/LogoHeader";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { formatDayTitle, toDateKey } from "@/lib/calendarDate";
import { getErrorMessage } from "@/lib/errorMessage";

import { useCalendarDrag } from "../hooks/useCalendarDrag";
import { useHomeFoldersQuery } from "../hooks/useHomeFoldersQuery";
import { useHomeTasks } from "../hooks/useHomeTasks";
import { useJoinTeamTaskMutation } from "../hooks/useJoinTeamTaskMutation";

import { CalendarDragOverlay } from "./CalendarDragOverlay";
import { CalendarHeader } from "./CalendarHeader";
import { DayTasksModalContent } from "./DayTasksModalContent";
import type { HomeTask } from "./homeData";
import { HomeTaskList } from "./HomeTaskList";
import { JoinTeamTaskModalForm } from "./JoinTeamTaskModalForm";
import { MonthCalendar } from "./MonthCalendar";
import { MonthPickerModal } from "./MonthPickerModal";
import { UnscheduledTasks } from "./UnscheduledTasks";

// Figma: FAB 아래 끝이 safe area 위 6px
const FAB_BOTTOM_OFFSET = 6;
// 마지막 카드가 FAB 에 가리지 않을 만큼
const CONTENT_BOTTOM_OFFSET = 96;

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();

  const today = new Date();
  const todayKey = toDateKey(today);
  const [viewMonth, setViewMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  const folders = useHomeFoldersQuery().data ?? [];
  const { mutate: joinTeamTask } = useJoinTeamTaskMutation();
  const {
    isError,
    selectedFolderIds,
    toggleFolder,
    itemsByDate,
    unscheduledItems,
    getDayItems,
    sort,
    setSort,
    sortedTasks,
    moveItem,
  } = useHomeTasks();
  const drag = useCalendarDrag(moveItem);

  const openTaskDetail = (task: HomeTask) => {
    router.push(
      task.type === "TEAM"
        ? `/tasks/team/${task.id}`
        : `/tasks/personal/${task.id}`
    );
  };

  const moveMonth = (offset: number) => {
    setViewMonth(({ year, month }) => {
      const date = new Date(year, month + offset, 1);
      return { year: date.getFullYear(), month: date.getMonth() };
    });
  };

  const openDayModal = (dateKey: string) => {
    openModal({
      title: formatDayTitle(dateKey),
      children: (
        <DayTasksModalContent
          items={getDayItems(dateKey).map(({ task, ...item }) => ({
            ...item,
            onPress: () => {
              closeModal();
              openTaskDetail(task);
            },
          }))}
        />
      ),
    });
  };

  const openJoinModal = () => {
    openModal({
      title: "과제 참여",
      headerIcon: "cancel",
      children: (
        <JoinTeamTaskModalForm
          folders={folders}
          onSubmit={(inviteCode, folderId) =>
            joinTeamTask(
              { inviteCode, folderId: folderId ?? undefined },
              {
                onSuccess: ({ task_id }) => {
                  closeModal();
                  router.push(`/tasks/team/${task_id}`);
                },
                onError: (error) =>
                  showToast(
                    "fail",
                    getErrorMessage(error, "팀 과제에 참여하지 못했습니다.")
                  ),
              }
            )
          }
        />
      ),
    });
  };

  return (
    // 캘린더 드래그앤드롭(react-native-gesture-handler)에 필요하다
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-0" style={{ paddingTop: insets.top }}>
        <LogoHeader onMenuPress={() => router.navigate("/menu")} />
        <ScrollView
          // drag 속성을 ref 에 바로 넘기면 react-hooks 린트가 drag 전체를 ref 로 본다
          ref={(view) => drag.registerViewport(view)}
          // 끄는 동안 드롭 영역 좌표가 바뀌지 않게 스크롤을 막는다
          scrollEnabled={drag.dragging === null}
          contentContainerClassName="gap-7 px-4 pt-5"
          contentContainerStyle={{
            paddingBottom: insets.bottom + CONTENT_BOTTOM_OFFSET,
          }}
        >
          <View className="gap-3">
            <CalendarHeader
              year={viewMonth.year}
              month={viewMonth.month}
              onTitlePress={() => setIsMonthPickerOpen(true)}
              onMonthMove={moveMonth}
              folders={folders}
              selectedFolderIds={selectedFolderIds}
              onToggleFolder={toggleFolder}
            />
            <View className="gap-2">
              <UnscheduledTasks items={unscheduledItems} drag={drag} />
              <MonthCalendar
                year={viewMonth.year}
                month={viewMonth.month}
                todayKey={todayKey}
                itemsByDate={itemsByDate}
                onDayPress={openDayModal}
                drag={drag}
              />
            </View>
          </View>

          {isError ? (
            <Text className="text-center text-gray-600 text-b-04-r">
              과제를 불러오지 못했습니다.
            </Text>
          ) : null}
          <HomeTaskList
            tasks={sortedTasks}
            sort={sort}
            onSortChange={setSort}
            onTaskPress={openTaskDetail}
          />
        </ScrollView>

        {isFabOpen ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="메뉴 닫기"
            onPress={() => setIsFabOpen(false)}
            className="absolute inset-0 bg-gray-900/40"
          />
        ) : null}
        {/* 하단 위치가 safe area 에 따라 달라져 style 로 준다 */}
        <View
          className="absolute right-4"
          style={{ bottom: insets.bottom + FAB_BOTTOM_OFFSET }}
        >
          <Fab
            open={isFabOpen}
            onOpenChange={setIsFabOpen}
            onCreateTask={() => router.push("/tasks/create")}
            onJoinTeamTask={openJoinModal}
          />
        </View>

        {isMonthPickerOpen ? (
          <MonthPickerModal
            initialYear={viewMonth.year}
            onSelect={(year, month) => {
              setViewMonth({ year, month });
              setIsMonthPickerOpen(false);
            }}
            onClose={() => setIsMonthPickerOpen(false)}
          />
        ) : null}

        <CalendarDragOverlay drag={drag} />
      </View>
    </GestureHandlerRootView>
  );
}
