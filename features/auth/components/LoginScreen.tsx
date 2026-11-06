import { Image, type ImageStyle } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";

import { LegalDocumentModal } from "./LegalDocumentModal";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "./legalDocuments";
import { SocialLoginButton } from "./SocialLoginButton";

//상태바 아래부터 로고까지의 간격
const CONTENT_TOP_OFFSET = 86;

const LOGO_STYLE = { width: 208, height: 36.827 } satisfies ImageStyle;

const LEGAL_DOCUMENTS = {
  terms: TERMS_OF_SERVICE,
  privacy: PRIVACY_POLICY,
};

type LegalDocumentKey = keyof typeof LEGAL_DOCUMENTS;

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openedDocument, setOpenedDocument] = useState<LegalDocumentKey | null>(
    null
  );

  return (
    <View className="flex-1 bg-gray-0">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4"
        contentContainerStyle={{
          paddingTop: insets.top + CONTENT_TOP_OFFSET,
          paddingBottom: insets.bottom,
        }}
      >
        <View className="items-center gap-3">
          <View className="h-[38.4px] justify-center">
            <Image
              source={require("@/assets/images/checktask-logo.png")}
              style={LOGO_STYLE}
              contentFit="contain"
              accessibilityLabel="CheckTask"
            />
          </View>
          <View className="items-center gap-2">
            <Text className="text-blue-700 text-h-03">
              경량 과제 관리 서비스, 채택
            </Text>
            <Text className="text-gray-600 text-b-03-r">
              이메일이나 SNS 간편 로그인으로 사용할 수 있어요
            </Text>
          </View>
        </View>

        <View className="mt-[41px] gap-3">
          <View>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="이메일을 입력하세요."
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              className="-mb-px rounded-b-none"
            />
            <Input
              shape="box-password"
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력하세요."
              autoCapitalize="none"
              autoComplete="password"
              className="rounded-t-none"
            />
          </View>
          <View className="flex-row justify-between">
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Text className="text-gray-400 text-b-04-r">회원가입</Text>
            </Pressable>
            <Pressable accessibilityRole="button" hitSlop={8}>
              <Text className="text-gray-400 text-b-04-r">비밀번호 찾기</Text>
            </Pressable>
          </View>
        </View>

        <Button label="이메일로 로그인" className="mt-7" />

        <View className="mt-5 flex-row items-center gap-2">
          <View className="h-px flex-1 bg-gray-400" />
          <Text className="text-gray-400 text-b-04-r">OR</Text>
          <View className="h-px flex-1 bg-gray-400" />
        </View>

        <View className="mt-5 gap-3">
          <SocialLoginButton provider="kakao" />
          <SocialLoginButton provider="apple" />
        </View>

        <Text className="mt-[60px] text-center text-gray-500 text-b-04-r">
          로그인 시{" "}
          <Text
            accessibilityRole="link"
            className="underline"
            onPress={() => setOpenedDocument("terms")}
          >
            이용약관
          </Text>{" "}
          및{" "}
          <Text
            accessibilityRole="link"
            className="underline"
            onPress={() => setOpenedDocument("privacy")}
          >
            개인정보처리방침
          </Text>
          에 동의한 것으로 간주됩니다.{"\n"}이메일 찾기 문의는 DM(@checktask_)로
          부탁드립니다.
        </Text>
      </ScrollView>

      {openedDocument ? (
        <LegalDocumentModal
          document={LEGAL_DOCUMENTS[openedDocument]}
          onClose={() => setOpenedDocument(null)}
        />
      ) : null}
    </View>
  );
}
