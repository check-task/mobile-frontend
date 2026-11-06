import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader } from "@/components/common/Header/BackHeader";

//피그마 기준 마지막 버튼 아래부터 홈 인디케이터 영역까지의 간격
const FOOTER_BOTTOM_OFFSET = 46;

type AuthStepLayoutProps = {
  children: ReactNode;
  footer: ReactNode;
  //뒤로가기를 눌렀을 때. 생략하면 이전 화면으로 돌아감
  onBack?: () => void;
};

// 회원가입·비밀번호 찾기 단계 화면의 공통 틀. 상단 헤더, 본문, 하단 고정 버튼으로 구성
export function AuthStepLayout({
  children,
  footer,
  onBack,
}: AuthStepLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-bg"
      style={{ paddingTop: insets.top }}
    >
      <BackHeader onBack={onBack ?? router.back} className="bg-bg" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="grow px-4 pt-10"
      >
        {children}
      </ScrollView>
      <View
        className="gap-3 px-4"
        style={{ paddingBottom: insets.bottom + FOOTER_BOTTOM_OFFSET }}
      >
        {footer}
      </View>
    </KeyboardAvoidingView>
  );
}

type AuthStepHeadingProps = {
  title: string;
  description: string;
};

export function AuthStepHeading({ title, description }: AuthStepHeadingProps) {
  return (
    <View className="gap-3">
      <Text className="text-gray-900 text-h-04">{title}</Text>
      <Text className="text-gray-600 text-b-02-r">{description}</Text>
    </View>
  );
}

export function AuthStepDivider() {
  return <View className="mb-[27px] mt-7 h-px bg-gray-200" />;
}
