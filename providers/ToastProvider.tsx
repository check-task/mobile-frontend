import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Snackbar } from "@/components/common/Snackbar/Snackbar";
import { Toast } from "@/components/common/Toast/Toast";
import { useToastStore } from "@/store/toastStore";

const SNACKBAR_TOP_GAP = 20;
const TOAST_BOTTOM_GAP = 46;
const APP_BAR_HEIGHT = 56;

export function ToastProvider() {
  const feedback = useToastStore((state) => state.feedback);
  const dismiss = useToastStore((state) => state.dismiss);
  const insets = useSafeAreaInsets();

  if (!feedback) {
    return null;
  }

  if (feedback.kind === "snackbar") {
    const { message, onUndo } = feedback;

    return (
      <View
        pointerEvents="box-none"
        // 안전 영역 높이는 런타임 값이라 className으로 표현할 수 없어 style로 넘긴다.
        style={{ top: insets.top + APP_BAR_HEIGHT + SNACKBAR_TOP_GAP }}
        className="absolute inset-x-4"
      >
        <Snackbar
          message={message}
          onUndo={
            onUndo
              ? () => {
                  onUndo();
                  dismiss();
                }
              : undefined
          }
        />
      </View>
    );
  }

  return (
    <View
      pointerEvents="none"
      style={{ bottom: insets.bottom + TOAST_BOTTOM_GAP }}
      className="absolute inset-x-4 items-center"
    >
      <Toast type={feedback.type} message={feedback.message} />
    </View>
  );
}
