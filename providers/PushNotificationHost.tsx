import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { getTokens } from "@/lib/api/tokenStorage";
import {
  ANDROID_CHANNEL_ID,
  isPushSupported,
  loadMessaging,
  loadNotifications,
  registerDeviceToken,
  registerPushToken,
} from "@/lib/push/pushNotifications";

// 서버 알림에는 이동할 과제 정보가 없어서 알림을 누르면 알림 목록으로 보낸다
const NOTIFICATION_ROUTE = "/notification";

export function PushNotificationHost() {
  const router = useRouter();

  useEffect(() => {
    if (!isPushSupported) {
      return;
    }

    let active = true;
    const cleanups: (() => void)[] = [];
    const openNotificationList = () => router.navigate(NOTIFICATION_ROUTE);

    const setUp = async () => {
      const Notifications = await loadNotifications();
      const Messaging = await loadMessaging();
      if (!active) {
        return;
      }
      const instance = Messaging.getMessaging();

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      // Android 는 앱을 쓰는 중에 받은 FCM 알림을 시스템이 띄우지 않아서 직접 띄운다. iOS 는 위 핸들러가 띄운다
      cleanups.push(
        Messaging.onMessage(instance, (message) => {
          if (Platform.OS !== "android" || !message.notification) {
            return;
          }
          void Notifications.scheduleNotificationAsync({
            content: {
              title: message.notification.title,
              body: message.notification.body,
            },
            trigger: { channelId: ANDROID_CHANNEL_ID },
          });
        })
      );

      cleanups.push(
        Messaging.onTokenRefresh(instance, (fcmToken) => {
          void getTokens().then((tokens) => {
            if (tokens) {
              registerDeviceToken(fcmToken).catch((error: unknown) =>
                console.warn("푸시 토큰 갱신 등록 실패", error)
              );
            }
          });
        })
      );

      // 앱이 백그라운드일 때 시스템이 띄운 FCM 알림을 누른 경우
      cleanups.push(
        Messaging.onNotificationOpenedApp(instance, openNotificationList)
      );
      // 앱이 꺼져 있을 때 알림을 눌러 켠 경우
      const initial = await Messaging.getInitialNotification(instance);
      if (!active) {
        return;
      }
      // expo-notifications 가 띄운 알림으로 앱을 켜면 Firebase 는 모르므로 따로 확인한다
      const lastResponse = Notifications.getLastNotificationResponse();
      const launchedId = lastResponse?.notification.request.identifier;
      // 앱을 쓰는 중에 띄운 알림을 누른 경우. 앱을 켠 알림은 아래에서 한 번만 연다
      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          if (response.notification.request.identifier !== launchedId) {
            openNotificationList();
          }
        });
      cleanups.push(() => subscription.remove());
      if (initial || lastResponse) {
        openNotificationList();
        Notifications.clearLastNotificationResponse();
      }

      if (await getTokens()) {
        await registerPushToken();
      }
    };

    setUp().catch((error: unknown) =>
      console.warn("푸시 알림 설정 실패", error)
    );

    return () => {
      active = false;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [router]);

  return null;
}
