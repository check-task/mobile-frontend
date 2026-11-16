import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Fab } from "@/components/common/Fab/Fab";
import { LogoHeader } from "@/components/common/Header/LogoHeader";
import { useModal } from "@/hooks/useModal";
import { formatDayTitle, toDateKey } from "@/lib/calendarDate";

import { useHomeTasks } from "../hooks/useHomeTasks";

import { CalendarHeader } from "./CalendarHeader";
import { DayTasksModalContent } from "./DayTasksModalContent";
import { DUMMY_JOINED_TASK_ID, HOME_FOLDERS, type HomeTask } from "./homeData";
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

  const today = new Date();
  const todayKey = toDateKey(today);
  const [viewMonth, setViewMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  const {
    selectedFolderIds,
    toggleFolder,
    itemsByDate,
    unscheduledItems,
    getDayItems,
    sort,
    setSort,
    sortedTasks,
  } = useHomeTasks();

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
          folders={HOME_FOLDERS}
          onSubmit={() => {
            closeModal();
            router.push(`/tasks/team/${DUMMY_JOINED_TASK_ID}`);
          }}
        />
      ),
    });
  };

  return (
    <View className="flex-1 bg-gray-0" style={{ paddingTop: insets.top }}>
      <LogoHeader onMenuPress={() => router.navigate("/menu")} />
      <ScrollView
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
            folders={HOME_FOLDERS}
            selectedFolderIds={selectedFolderIds}
            onToggleFolder={toggleFolder}
          />
          <View className="gap-2">
            <UnscheduledTasks items={unscheduledItems} />
            <MonthCalendar
              year={viewMonth.year}
              month={viewMonth.month}
              todayKey={todayKey}
              itemsByDate={itemsByDate}
              onDayPress={openDayModal}
            />
          </View>
        </View>

        <HomeTaskList
          tasks={sortedTasks}
          folders={HOME_FOLDERS}
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
    </View>
  );
}
