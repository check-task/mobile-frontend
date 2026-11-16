import { useMutation } from "@tanstack/react-query";

import { resendEmailCode } from "../api/authApi";

export function useResendEmailCodeMutation() {
  return useMutation({ mutationFn: resendEmailCode });
}
