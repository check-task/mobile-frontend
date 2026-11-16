import { type ComponentRef, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { BottomFill, Check } from "@/components/icons";
import { ALARM_HOUR_OPTIONS } from "@/constants/settings";
import { DROPDOWN_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

// 항목 높이(p-2 + 14px*1.5)와 한 번에 보이는 항목 수
const OPTION_HEIGHT = 37;
const VISIBLE_OPTIONS = 5;
const LIST_HEIGHT = OPTION_HEIGHT * VISIBLE_OPTIONS + 8;
const MENU_GAP = 4;

type Anchor = { x: number; y: number; width: number; height: number };

type AlarmHourSelectProps = {
  label: string;
  value: number;
  onChange: (hours: number) => void;
};

export function AlarmHourSelect({
  label,
  value,
  onChange,
}: AlarmHourSelectProps) {
  const triggerRef = useRef<ComponentRef<typeof Pressable>>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const open = () =>
    triggerRef.current?.measureInWindow((x, y, width, height) =>
      setAnchor({ x, y, width, height })
    );
  const close = () => setAnchor(null);

  // 아래 공간이 모자라면 위로 연다
  const top = anchor
    ? anchor.y + anchor.height + MENU_GAP + LIST_HEIGHT > windowHeight
      ? anchor.y - MENU_GAP - LIST_HEIGHT
      : anchor.y + anchor.height + MENU_GAP
    : 0;
  const selectedIndex = ALARM_HOUR_OPTIONS.indexOf(value);

  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-gray-400 text-b-02-r">{label}</Text>
      <Pressable
        ref={triggerRef}
        accessibilityRole="button"
        accessibilityLabel={`${label} ${value}시간 전, 변경`}
        onPress={open}
        hitSlop={8}
        className="flex-row items-center gap-1"
      >
        <Text className="text-gray-700 text-b-02-m">{value}시간 전</Text>
        <BottomFill variant="lg" className="text-gray-700" />
      </Pressable>

      <Modal
        visible={anchor !== null}
        transparent
        statusBarTranslucent
        onRequestClose={close}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="닫기"
          className="absolute inset-0"
          onPress={close}
        />
        {anchor ? (
          <View
            style={[
              DROPDOWN_SHADOW,
              { top, right: windowWidth - (anchor.x + anchor.width) },
            ]}
            className="absolute rounded-lg bg-gray-0 p-1"
          >
            <ScrollView
              style={{ height: LIST_HEIGHT - 8 }}
              contentOffset={{
                x: 0,
                y: Math.max(0, selectedIndex - 2) * OPTION_HEIGHT,
              }}
              showsVerticalScrollIndicator={false}
            >
              {ALARM_HOUR_OPTIONS.map((hours) => {
                const selected = hours === value;
                return (
                  <Pressable
                    key={hours}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onChange(hours);
                      close();
                    }}
                    className={cn(
                      "h-[37px] w-[93px] flex-row items-center gap-0.5 rounded p-2",
                      selected ? "bg-blue-50 pr-1" : ""
                    )}
                  >
                    <Text
                      className={
                        selected
                          ? "text-primary text-b-02-m"
                          : "text-gray-700 text-b-02-r"
                      }
                    >
                      {hours}시간 전
                    </Text>
                    {selected ? <Check className="text-primary" /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}
