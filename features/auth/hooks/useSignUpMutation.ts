import { useMutation } from "@tanstack/react-query";

import { signUp } from "../api/authApi";

export function useSignUpMutation() {
  return useMutation({ mutationFn: signUp });
}
