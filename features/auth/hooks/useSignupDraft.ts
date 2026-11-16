import { create } from "zustand";

type SignupDraft = {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
};

// 회원가입 단계끼리 넘기는 값. 비밀번호가 주소에 남지 않게 route param 대신 메모리에 둔다
export const useSignupDraft = create<SignupDraft>((set) => ({
  email: "",
  password: "",
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  reset: () => set({ email: "", password: "" }),
}));
