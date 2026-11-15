import { useToastStore } from "@/store/toastStore";

export function useToast() {
  const showToast = useToastStore((state) => state.showToast);
  const showSnackbar = useToastStore((state) => state.showSnackbar);
  const dismiss = useToastStore((state) => state.dismiss);

  return { showToast, showSnackbar, dismiss };
}
