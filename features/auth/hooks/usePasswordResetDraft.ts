import { create } from "zustand";

type PasswordResetDraft = {
  email: string;
  resetToken: string;
  /** 마지막으로 인증코드를 보낸 시각(ms). 서버가 2분 안의 재발송을 조용히 무시해서 앱에서 막는다 */
  codeSentAt: number;
  setEmail: (email: string) => void;
  setResetToken: (resetToken: string) => void;
  markCodeSent: () => void;
  reset: () => void;
};

// 비밀번호 찾기 단계끼리 넘기는 값. resetToken 이 주소에 남지 않게 메모리에 둔다
export const usePasswordResetDraft = create<PasswordResetDraft>((set) => ({
  email: "",
  resetToken: "",
  codeSentAt: 0,
  setEmail: (email) => set({ email }),
  setResetToken: (resetToken) => set({ resetToken }),
  markCodeSent: () => set({ codeSentAt: Date.now() }),
  reset: () => set({ email: "", resetToken: "", codeSentAt: 0 }),
}));
