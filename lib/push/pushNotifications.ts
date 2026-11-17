import { isRunningInExpoGo } from "expo";
import * as Device from "expo-device";
import { Platform } from "react-native";

import { apiClient } from "@/lib/api/client";

// React Native Firebase 는 네이티브 코드라 Expo Go 와 웹에는 없다. 불러오기만 해도 오류가 나서 이 환경에서는 푸시를 쓰지 않는다
export const isPushSupported = Platform.OS !== "web" && !isRunningInExpoGo();

// app.json 의 expo-notifications defaultChannel 과 같아야 서버 알림이 이 채널로 표시된다
export const ANDROID_CHANNEL_ID = "default";

// 지원하는 환경에서만 불러와야 해서 import 문 대신 함수 안에서 불러온다
export const loadNotifications = () => import("expo-notifications");
export const loadMessaging = () => import("@react-native-firebase/messaging");

export function registerDeviceToken(fcmToken: string) {
  return apiClient.post<null>("/api/v1/alarm/device", { fcmToken });
}

// 알림 권한을 받고 FCM 토큰을 서버에 등록한다. 서버는 토큰을 30일만 보관해서 앱을 켤 때마다 다시 등록한다
export async function registerPushToken() {
  // iOS 시뮬레이터는 APNs 토큰을 받지 못한다
  if (!isPushSupported || !Device.isDevice) {
    return;
  }

  const Notifications = await loadNotifications();
  if (Platform.OS === "android") {
    // Android 13 이상은 채널이 하나라도 있어야 권한 창이 뜬다
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "기본 알림",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted && permission.canAskAgain) {
    permission = await Notifications.requestPermissionsAsync();
  }
  const allowed =
    permission.granted ||
    permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (!allowed) {
    return;
  }

  const { getMessaging, getToken } = await loadMessaging();
  await registerDeviceToken(await getToken(getMessaging()));
}
