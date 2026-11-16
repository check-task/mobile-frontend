import { Pressable, Text, View } from "react-native";

import { CARD_SHADOW } from "@/constants/shadows";
import { getMonthGrid, toDateKey } from "@/lib/calendarDate";
import { cn } from "@/lib/utils";

import type { CalendarDrag } from "../hooks/useCalendarDrag";

import { CalendarTaskPill } from "./CalendarTaskPill";
import { DraggableCalendarPill } from "./DraggableCalendarPill";
import type { CalendarItem } from "./homeData";

const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
const DAYS_PER_WEEK = WEEKDAY_LABELS.length;

type MonthCalendarProps = {
  year: number;
  /** 0 = 1월 */
  month: number;
  todayKey: string;
  itemsByDate: ReadonlyMap<string, CalendarItem[]>;
  onDayPress: (dateKey: string) => void;
  drag: CalendarDrag;
};

export function MonthCalendar({
  year,
  month,
  todayKey,
  itemsByDate,
  onDayPress,
  drag,
}: MonthCalendarProps) {
  const days = getMonthGrid(year, month);
  const weeks = Array.from({ length: days.length / DAYS_PER_WEEK }, (_, i) =>
    days.slice(i * DAYS_PER_WEEK, (i + 1) * DAYS_PER_WEEK)
  );

  return (
    <View style={CARD_SHADOW} className="rounded-lg bg-gray-0">
      <View className="flex-row overflow-hidden rounded-t-lg">
        {WEEKDAY_LABELS.map((label) => (
          <View
            key={label}
            className="flex-1 border-x-[0.5px] border-t-[0.5px] border-gray-100 bg-blue-100 px-1.5 py-2"
          >
            <Text className="text-gray-800 text-calendar">{label}</Text>
          </View>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={toDateKey(week[0])} className="flex-row">
          {week.map((date, dayIndex) => {
            const dateKey = toDateKey(date);
            const isToday = dateKey === todayKey;
            const isCurrentMonth = date.getMonth() === month;
            const isLastWeek = weekIndex === weeks.length - 1;

            return (
              <Pressable
                key={dateKey}
                ref={drag.zoneRef(dateKey)}
                accessibilityRole="button"
                accessibilityLabel={`${date.getMonth() + 1}월 ${date.getDate()}일`}
                onPress={() => {
                  if (!drag.isJustDropped()) onDayPress(dateKey);
                }}
                className={cn(
                  "min-h-[50px] flex-1 gap-1 border-[0.5px] border-gray-100 px-1 pb-1.5 pt-1",
                  isLastWeek && dayIndex === 0 ? "rounded-bl" : "",
                  isLastWeek && dayIndex === DAYS_PER_WEEK - 1
                    ? "rounded-br"
                    : ""
                )}
              >
                <View
                  className={cn(
                    "size-3 items-center justify-center rounded-full",
                    isToday ? "bg-blue-500" : ""
                  )}
                >
                  <Text
                    className={cn(
                      "text-calendar",
                      isToday
                        ? "text-gray-0"
                        : isCurrentMonth
                          ? "text-gray-800"
                          : "text-gray-300"
                    )}
                  >
                    {date.getDate()}
                  </Text>
                </View>
                <View className="items-start gap-0.5">
                  {itemsByDate.get(dateKey)?.map((item) => (
                    <DraggableCalendarPill
                      key={item.key}
                      item={item}
                      drag={drag}
                    >
                      <CalendarTaskPill
                        title={item.title}
                        color={item.color}
                        variant={item.kind}
                      />
                    </DraggableCalendarPill>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
