import type { ReactNode } from "react";
import { Modal, Pressable, useWindowDimensions, View } from "react-native";

export type AnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const MENU_GAP = 4;

type MenuPopoverProps = {
  /** 메뉴를 붙일 요소의 화면 좌표(`measureInWindow`). `null`이면 닫혀 있다. */
  anchor: AnchorRect | null;
  /** 기준 요소의 어느 끝에 메뉴를 맞출지 */
  align: "left" | "right";
  onClose: () => void;
  children: ReactNode;
};

// 행 밖으로 나오는 메뉴는 안드로이드에서 터치가 전달되지 않아, 화면 맨 위 층(Modal)에 띄운다.
export function MenuPopover({
  anchor,
  align,
  onClose,
  children,
}: MenuPopoverProps) {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <Modal
      visible={anchor !== null}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="메뉴 닫기"
        className="absolute inset-0"
        onPress={onClose}
      />
      {anchor ? (
        <View
          className="absolute"
          style={{
            top: anchor.y + anchor.height + MENU_GAP,
            ...(align === "left"
              ? { left: anchor.x }
              : { right: windowWidth - (anchor.x + anchor.width) }),
          }}
        >
          {children}
        </View>
      ) : null}
    </Modal>
  );
}
