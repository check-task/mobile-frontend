import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button/Button";
import { cn } from "@/lib/utils";

type OnboardingSlide = {
  key: string;
  title: string;
  description: string;
  contentClassName: string;
};

const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    key: "priority",
    title: "명도차이로 확인하는 과제 마감 우선순위",
    description:
      "홈화면의 달력으로 이달의 전체 일정을 한 눈에 확인해요.\n또, 과제 마감의 우선순위를 직관적으로 알려줘요.",
    contentClassName: "bg-gray-0",
  },
  {
    key: "progress",
    title: "한 눈에 확인하는 과제 진척도",
    description:
      "과제별로 세부 TASK와 필요한 자료를 등록해요.\nTASK 완료에 따라 과제 진척도를 확인할 수 있어요.",
    contentClassName: "bg-bg",
  },
  {
    key: "team",
    title: "세부 과제별로 팀원들과 소통하기",
    description:
      "코드 공유로 팀원을 초대하고 팀프로젝트를 진행해요.\nTASK별로 담당자 설정과 의사소통이 가능해요.",
    contentClassName: "bg-bg",
  },
];

const LAST_INDEX = ONBOARDING_SLIDES.length - 1;

export function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const finishOnboarding = () => {
    router.replace("/");
  };

  const handleNext = () => {
    if (activeIndex >= LAST_INDEX) {
      finishOnboarding();
      return;
    }

    listRef.current?.scrollToOffset({
      offset: width * (activeIndex + 1),
      animated: true,
    });
  };

  return (
    <View className="flex-1 bg-bg">
      <View
        className="flex-1"
        onLayout={(event) => setPageHeight(event.nativeEvent.layout.height)}
      >
        <FlatList
          ref={listRef}
          data={ONBOARDING_SLIDES}
          keyExtractor={(slide) => slide.key}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          renderItem={({ item, index }) => (
            <View style={{ width, height: pageHeight }}>
              <View className="flex-1 bg-blue-50" />
              <View
                className={cn(
                  "h-[330px] items-center gap-6 px-[30px] pt-10",
                  item.contentClassName
                )}
              >
                <View className="w-full items-center gap-3">
                  <Text className="text-center text-gray-900 text-h-03">
                    {item.title}
                  </Text>
                  <Text className="text-center text-gray-900 text-b-02-r">
                    {item.description}
                  </Text>
                </View>
                <OnboardingIndicator activeIndex={index} />
              </View>
            </View>
          )}
        />
        <Button
          label="건너뛰기"
          variant="white"
          size="xl"
          onPress={finishOnboarding}
          className="absolute bottom-3 left-0"
        />
      </View>
      <View className="bg-primary" style={{ paddingBottom: insets.bottom }}>
        <Button label="다음" size="xl" onPress={handleNext} />
      </View>
    </View>
  );
}

function OnboardingIndicator({ activeIndex }: { activeIndex: number }) {
  return (
    <View className="flex-row gap-2">
      {ONBOARDING_SLIDES.map((slide, index) => (
        <View
          key={slide.key}
          className={cn(
            "size-2 rounded-full",
            index === activeIndex ? "bg-primary" : "bg-gray-200"
          )}
        />
      ))}
    </View>
  );
}
