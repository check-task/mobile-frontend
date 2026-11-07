import { Fragment } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LogoHeader } from "@/components/common/Header/LogoHeader";

import { NoticeItem } from "./NoticeItem";
import { NOTICES } from "./notices";

//마지막 공지 아래 여백
const CONTENT_BOTTOM_OFFSET = 24;

export function NoticeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-0" style={{ paddingTop: insets.top }}>
      {/*메뉴 화면이 추가되면 onMenuPress 연결하기*/}
      <LogoHeader />
      <ScrollView
        contentContainerClassName="gap-5 px-4 pt-5"
        contentContainerStyle={{
          paddingBottom: insets.bottom + CONTENT_BOTTOM_OFFSET,
        }}
      >
        <Text className="text-gray-900 text-h-02">공지사항</Text>
        <View className="gap-6">
          {NOTICES.map((notice, index) => (
            <Fragment key={notice.id}>
              {index > 0 ? <View className="h-px bg-gray-200" /> : null}
              <NoticeItem notice={notice} />
            </Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
