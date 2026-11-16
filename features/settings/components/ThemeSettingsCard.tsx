import { Fragment } from "react";
import { Pressable, Text, View } from "react-native";

import { CheckCircle } from "@/components/icons";
import type { ThemePreference } from "@/hooks/useThemePreference";

import { SettingsCard } from "./SettingsCard";

const THEME_OPTIONS: readonly { value: ThemePreference; label: string }[] = [
  { value: "light", label: "라이트 모드" },
  { value: "dark", label: "다크 모드" },
  { value: "system", label: "시스템 설정" },
];

type ThemeSettingsCardProps = {
  value: ThemePreference;
  onChange: (value: ThemePreference) => void;
};

export function ThemeSettingsCard({ value, onChange }: ThemeSettingsCardProps) {
  return (
    <SettingsCard className="gap-3 py-3">
      {THEME_OPTIONS.map((option, index) => {
        const selected = option.value === value;
        return (
          <Fragment key={option.value}>
            {index > 0 ? <View className="h-px bg-gray-100" /> : null}
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => onChange(option.value)}
              className="h-6 flex-row items-center justify-between"
            >
              <Text className="text-gray-700 text-b-02-r">{option.label}</Text>
              {selected ? (
                <CheckCircle variant="lg" className="text-gray-700" />
              ) : null}
            </Pressable>
          </Fragment>
        );
      })}
    </SettingsCard>
  );
}
