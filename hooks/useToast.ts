import { useToastStore } from "@/store/toastStore";

export function useToast() {
  const showToast = useToastStore((state) => state.showToast);
  const showSnackbar = useToastStore((state) => state.showSnackbar);

  return { showToast, showSnackbar };
}
