import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import { signOut } from "@/lib/api/client";
import { disconnectSocket } from "@/lib/socket/socketClient";

// 로그아웃 버튼 위치가 정해지지 않아서(메뉴·설정 등) 여러 화면에서 쓸 수 있게 공용 hook 으로 둔다
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: signOut,
    // signOut 은 서버 요청이 실패해도 토큰을 지우므로 항상 로그인 화면으로 보낸다
    onSettled: () => {
      disconnectSocket();
      // 뒤로가기로 로그인 상태 화면에 돌아오지 않게 쌓인 화면을 비운다
      if (router.canDismiss()) router.dismissAll();
      router.replace("/login");
      // 화면을 먼저 내린 뒤 비워야 남아 있던 화면이 토큰 없이 다시 불러오지 않는다
      queryClient.clear();
    },
  });
}
