import { useMutation } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/apiError";

import { checkEmail, sendEmailCode } from "../api/authApi";

export function useSendSignupCodeMutation() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { isDuplicate } = await checkEmail(email);
      if (isDuplicate) {
        throw new ApiError(400, "EMAIL_DUPLICATE", "이미 가입된 이메일입니다.");
      }
      await sendEmailCode(email);
    },
  });
}
