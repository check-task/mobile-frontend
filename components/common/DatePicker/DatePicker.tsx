import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Toggle } from "@/components/common/Toggle/Toggle";
import { CheckCircle, Left, Right } from "@/components/icons";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const DAYS_PER_WEEK = WEEKDAYS.length;
const WEEK_ROWS = 6;

type DayState = "default" | "outside" | "selected" | "disabled";

const DAY_CIRCLE_CLASS: Record<DayState, string> = {
  default: "",
  outside: "",
  selected: "bg-primary",
  disabled: "",
};

const DAY_TEXT_CLASS: Record<DayState, string> = {
  default: "text-gray-900",
  outside: "text-gray-600 opacity-[0.38]",
  selected: "text-bg font-medium",
  disabled: "text-gray-400 opacity-[0.38]",
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(date: Date) {
  const hours = date.getHours();

  return {
    period: hours < 12 ? "오전" : "오후",
    hour: String(hours % 12).padStart(2, "0"),
    minute: String(date.getMinutes()).padStart(2, "0"),
  };
}

function buildMonthWeeks(viewMonth: Date) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const leadingDays = new Date(year, month, 1).getDay();

  return Array.from({ length: WEEK_ROWS }, (_, row) =>
    Array.from(
      { length: DAYS_PER_WEEK },
      (_, column) =>
        new Date(year, month, 1 - leadingDays + row * DAYS_PER_WEEK + column)
    )
  );
}

export type DatePickerProps = {
  /** 선택된 날짜 */
  value: Date;
  /** 날짜를 눌렀을 때 */
  onChange: (date: Date) => void;
  /** `시간 추가` 토글 상태 */
  timeEnabled: boolean;
  /** `시간 추가` 토글을 눌렀을 때 */
  onTimeEnabledChange: (enabled: boolean) => void;
  /** `저장`을 눌렀을 때 */
  onSave: () => void;
  /** 이 날짜보다 이전 날짜는 선택할 수 없다. 넘기지 않으면 제한이 없다. */
  minDate?: Date;
  /** `날짜 지정 안함` 선택 여부 */
  noDate?: boolean;
  /** `날짜 지정 안함`을 눌렀을 때. 넘기지 않으면 이 줄을 그리지 않는다. */
  onNoDateChange?: (noDate: boolean) => void;
  /** 시간 칩을 눌렀을 때. 넘기지 않으면 탭할 수 없는 표시 전용 칩이 된다. */
  onTimePress?: () => void;
  /** 바깥 여백·위치 보정용. 너비는 달력 격자(224px)에 맞춰진다. */
  className?: string;
};

/**
 * Figma `(mobile) date picker`를 옮긴 달력. 월 이동, 날짜 선택, `시간 추가` 토글, `저장`으로 구성된다.
 * 보이는 달은 내부 상태이고, 이전/다음 달에 걸친 날짜를 누르면 그 달로 넘어간다.
 */
export function DatePicker({
  value,
  onChange,
  timeEnabled,
  onTimeEnabledChange,
  onSave,
  minDate,
  noDate = false,
  onNoDateChange,
  onTimePress,
  className,
}: DatePickerProps) {
  const [viewMonth, setViewMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1)
  );
  const weeks = buildMonthWeeks(viewMonth);
  const minDay = minDate ? startOfDay(minDate) : null;
  const time = formatTime(value);

  const moveMonth = (offset: number) => {
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1)
    );
  };

  const selectDay = (day: Date) => {
    setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1));
    onChange(day);
  };

  return (
    <View
      style={CARD_SHADOW}
      className={cn(
        "items-end gap-4 self-start rounded-lg bg-gray-0 p-4",
        className
      )}
    >
      <View className="gap-3">
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 text-b-04-m">
              {`${viewMonth.getFullYear()}년 ${viewMonth.getMonth() + 1}월`}
            </Text>
            <View className="flex-row gap-1">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="이전 달"
                onPress={() => moveMonth(-1)}
                hitSlop={8}
              >
                <Left className="text-gray-900" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="다음 달"
                onPress={() => moveMonth(1)}
                hitSlop={8}
              >
                <Right className="text-gray-900" />
              </Pressable>
            </View>
          </View>

          <View className="relative rounded-lg py-1">
            {/* 피그마 테두리는 프레임 안쪽이라 레이아웃 크기에 넣지 않고 겹쳐 그린다. */}
            <View
              pointerEvents="none"
              className="absolute inset-0 rounded-lg border border-gray-100"
            />
            <View className="flex-row border-b border-gray-100 pb-[3px]">
              {WEEKDAYS.map((weekday, index) => (
                <View
                  key={`${weekday}-${index}`}
                  className="h-8 w-8 items-center justify-center"
                >
                  <Text className="text-gray-900 text-caption">{weekday}</Text>
                </View>
              ))}
            </View>

            <View className="gap-0.5">
              {weeks.map((week) => (
                <View key={week[0].getTime()} className="flex-row">
                  {week.map((day) => {
                    const state: DayState =
                      minDay && day < minDay
                        ? "disabled"
                        : isSameDay(day, value)
                          ? "selected"
                          : day.getMonth() !== viewMonth.getMonth()
                            ? "outside"
                            : "default";

                    return (
                      <Pressable
                        key={day.getTime()}
                        accessibilityRole="button"
                        accessibilityLabel={`${day.getFullYear()}년 ${day.getMonth() + 1}월 ${day.getDate()}일`}
                        accessibilityState={{
                          selected: state === "selected",
                          disabled: state === "disabled",
                        }}
                        disabled={state === "disabled"}
                        onPress={() => selectDay(day)}
                        className="h-8 w-8 items-center justify-center"
                      >
                        <View
                          className={cn(
                            "h-7 w-7 items-center justify-center rounded-full",
                            DAY_CIRCLE_CLASS[state]
                          )}
                        >
                          <Text
                            className={cn(
                              "text-caption",
                              DAY_TEXT_CLASS[state]
                            )}
                          >
                            {day.getDate()}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>

        {onNoDateChange ? (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: noDate }}
            onPress={() => onNoDateChange(!noDate)}
            className="flex-row items-center justify-between"
          >
            <Text className="text-gray-900 text-b-04-r">날짜 지정 안함</Text>
            <CheckCircle
              className={noDate ? "text-gray-900" : "text-gray-300"}
            />
          </Pressable>
        ) : null}

        <View className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 text-b-04-r">시간 추가</Text>
            <Toggle
              value={timeEnabled}
              onValueChange={onTimeEnabledChange}
              accessibilityLabel="시간 추가"
            />
          </View>

          {timeEnabled ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600 text-caption">
                {`${value.getFullYear()}년 ${value.getMonth() + 1}월 ${value.getDate()}일`}
              </Text>
              <Pressable
                accessibilityRole={onTimePress ? "button" : undefined}
                onPress={onTimePress}
                className="flex-row items-center gap-1 rounded-[2px] border border-gray-600 px-1 py-0.5"
              >
                <Text className="text-gray-600 text-caption">
                  {time.period}
                </Text>
                <View className="flex-row items-center gap-0.5">
                  <Text className="text-gray-600 text-caption">
                    {time.hour}
                  </Text>
                  <Text className="text-gray-600 text-caption">:</Text>
                  <Text className="text-gray-600 text-caption">
                    {time.minute}
                  </Text>
                </View>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>

      <Button label="저장" size="sm" onPress={onSave} />
    </View>
  );
}
