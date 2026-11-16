import { useMutation } from "@tanstack/react-query";

import { verifyPasswordResetCode } from "../api/authApi";

export function useVerifyPasswordResetCodeMutation() {
  return useMutation({ mutationFn: verifyPasswordResetCode });
}
