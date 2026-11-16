import { useMutation } from "@tanstack/react-query";

import { verifyEmailCode } from "../api/authApi";

export function useVerifyEmailCodeMutation() {
  return useMutation({ mutationFn: verifyEmailCode });
}
