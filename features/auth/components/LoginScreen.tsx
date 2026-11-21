import { Image, type ImageStyle } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";

import {
  useAppleSignInAvailable,
  useAppleSignInMutation,
} from "../hooks/useAppleSignInMutation";
import { useKakaoSignInMutation } from "../hooks/useKakaoSignInMutation";
import { useSignInMutation } from "../hooks/useSignInMutation";

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

function getSignInErrorMessage(error: Error) {
  // 401은 서버 문구(이메일 또는 비밀번호가 올바르지 않습니다.)를 그대로 보여준다
  if (error instanceof ApiError && error.status === 401) {
    return error.reason;
  }
  return "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.";
}

export function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const signInMutation = useSignInMutation();
  const kakaoSignInMutation = useKakaoSignInMutation();
  const appleSignInMutation = useAppleSignInMutation();
  const isAppleSignInAvailable = useAppleSignInAvailable();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openedDocument, setOpenedDocument] = useState<LegalDocumentKey | null>(
    null
  );

  // 두 로그인이 겹치면 늦게 끝난 쪽 토큰으로 세션이 바뀌어서, 하나가 끝날 때까지 다른 로그인은 막는다
  const isSigningIn =
    signInMutation.isPending ||
    kakaoSignInMutation.isPending ||
    appleSignInMutation.isPending;

  const submit = () => {
    if (isSigningIn) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      showToast("fail", "이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    signInMutation.mutate(
      { email: trimmedEmail, password },
      {
        onSuccess: () => router.replace("/"),
        onError: (error) => showToast("fail", getSignInErrorMessage(error)),
      }
    );
  };

  const signInWithKakao = () => {
    if (isSigningIn) return;
    kakaoSignInMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.status === "signedIn") router.replace("/");
        // 복구 흐름(디자인·앱용 복구 API)이 정해지기 전까지는 안내만 한다
        if (result.status === "withdrawn") {
          showToast("fail", "탈퇴 처리된 계정이에요.");
        }
      },
      onError: () =>
        showToast(
          "fail",
          "카카오 로그인을 하지 못했어요. 잠시 후 다시 시도해 주세요."
        ),
    });
  };

  const signInWithApple = () => {
    if (isSigningIn) return;
    appleSignInMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (result.status === "signedIn") router.replace("/");
        if (result.status === "withdrawn") {
          showToast("fail", "탈퇴 처리된 계정이에요.");
        }
      },
      onError: () =>
        showToast(
          "fail",
          "Apple 로그인을 하지 못했어요. 잠시 후 다시 시도해 주세요."
        ),
    });
  };

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
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.push("/signup")}
            >
              <Text className="text-gray-400 text-b-04-r">회원가입</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.push("/find-password")}
            >
              <Text className="text-gray-400 text-b-04-r">비밀번호 찾기</Text>
            </Pressable>
          </View>
        </View>

        <Button label="이메일로 로그인" onPress={submit} className="mt-7" />

        <View className="mt-5 flex-row items-center gap-2">
          <View className="h-px flex-1 bg-gray-400" />
          <Text className="text-gray-400 text-b-04-r">OR</Text>
          <View className="h-px flex-1 bg-gray-400" />
        </View>

        <View className="mt-5 gap-3">
          <SocialLoginButton provider="kakao" onPress={signInWithKakao} />
          {isAppleSignInAvailable && (
            <SocialLoginButton provider="apple" onPress={signInWithApple} />
          )}
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
