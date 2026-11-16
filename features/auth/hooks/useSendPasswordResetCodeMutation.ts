import { useMutation } from "@tanstack/react-query";

import { sendPasswordResetCode } from "../api/authApi";

export function useSendPasswordResetCodeMutation() {
  return useMutation({ mutationFn: sendPasswordResetCode });
}
