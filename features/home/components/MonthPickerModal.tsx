import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { Left, Right } from "@/components/icons";
import { DROPDOWN_SHADOW } from "@/constants/shadows";

const MONTHS = Array.from({ length: 12 }, (_, index) => index);

type MonthPickerModalProps = {
  initialYear: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
};

// 열 때마다 새로 마운트되므로 연도는 열린 시점의 값에서 시작한다.
export function MonthPickerModal({
  initialYear,
  onSelect,
  onClose,
}: MonthPickerModalProps) {
  const [year, setYear] = useState(initialYear);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-gray-900/40">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="월 선택 닫기"
          onPress={onClose}
          className="absolute inset-0"
        />
        <View style={DROPDOWN_SHADOW} className="rounded-lg bg-bg p-2">
          {/* 앱에서는 rem 이 14px 라 w-40 이 140px 가 되어 월이 3열로 줄바꿈된다 → px 로 고정 */}
          <View className="w-[160px] flex-row items-center justify-between border-b border-gray-100 pb-2">
            <Text className="text-gray-900 text-b-01-m">{`${year}년`}</Text>
            <View className="flex-row gap-1">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="이전 연도"
                hitSlop={4}
                onPress={() => setYear((prev) => prev - 1)}
              >
                <Left variant="lg" className="text-gray-900" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="다음 연도"
                hitSlop={4}
                onPress={() => setYear((prev) => prev + 1)}
              >
                <Right variant="lg" className="text-gray-900" />
              </Pressable>
            </View>
          </View>
          <View className="w-[160px] flex-row flex-wrap gap-1">
            {MONTHS.map((month) => (
              <Pressable
                key={month}
                accessibilityRole="button"
                onPress={() => onSelect(year, month)}
                className="size-[37px] items-center justify-center"
              >
                <Text className="text-gray-700 text-b-03-r">{`${month + 1}월`}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
