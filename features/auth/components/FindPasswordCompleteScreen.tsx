import { useRouter } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/common/Button/Button";

import { AuthStepHeading, AuthStepLayout } from "./AuthStepLayout";

export function FindPasswordCompleteScreen() {
  const router = useRouter();
  const goToLogin = () => router.dismissTo("/login");

  return (
    <AuthStepLayout
      onBack={goToLogin}
      footer={<Button label="로그인하기" onPress={goToLogin} />}
    >
      <View className="flex-1 justify-center pb-[55px]">
        <AuthStepHeading
          title="비밀번호 재설정 완료"
          description={"비밀번호 재설정이 완료되었습니다.\n다시 로그인하세요."}
        />
      </View>
    </AuthStepLayout>
  );
}
