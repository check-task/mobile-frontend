import { useMutation } from "@tanstack/react-query";

import { confirmPasswordReset } from "../api/authApi";

export function useConfirmPasswordResetMutation() {
  return useMutation({ mutationFn: confirmPasswordReset });
}
