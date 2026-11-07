import { Text, View } from "react-native";

import type { Notice, NoticeSection } from "./notices";

type NoticeItemProps = {
  notice: Notice;
};

//공지 하나의 제목, 본문, 작성일
export function NoticeItem({ notice }: NoticeItemProps) {
  return (
    <View className="gap-4">
      <View className="gap-3">
        <Text className="text-gray-900 text-b-01-m">{notice.title}</Text>
        {notice.sections.map((section, index) => (
          <NoticeSectionView key={index} section={section} />
        ))}
      </View>
      <View className="gap-2">
        <Text className="text-gray-600 text-b-03-r">{notice.closing}</Text>
        <Text className="text-gray-400 text-b-04-m">{notice.date}</Text>
      </View>
    </View>
  );
}

function NoticeSectionView({ section }: { section: NoticeSection }) {
  if (section.type === "intro") {
    return <Text className="text-gray-700 text-b-02-r">{section.text}</Text>;
  }

  return (
    <View>
      <Text className="text-gray-800 text-b-02-m">{section.heading}</Text>
      {section.type === "list" ? (
        section.items.map((item) => (
          <View key={item} className="flex-row">
            <Text className="w-[21px] text-center text-gray-600 text-b-02-r">
              •
            </Text>
            <Text className="flex-1 text-gray-600 text-b-02-r">{item}</Text>
          </View>
        ))
      ) : (
        <Text className="text-gray-600 text-b-02-r">{section.text}</Text>
      )}
    </View>
  );
}
