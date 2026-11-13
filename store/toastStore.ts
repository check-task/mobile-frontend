import { create } from "zustand";

import type { ToastType } from "@/components/common/Toast/Toast";

const TOAST_DURATION_MS = 2000;
const SNACKBAR_DURATION_MS = 4000;

export type Feedback =
  | { kind: "toast"; type: ToastType; message: string }
  | { kind: "snackbar"; message: string; onUndo?: () => void };

export type ToastStore = {
  feedback: Feedback | null;
  showToast: (type: ToastType, message: string) => void;
  showSnackbar: (message: string, onUndo?: () => void) => void;
  dismiss: () => void;
};

let dismissTimer: ReturnType<typeof setTimeout> | undefined;

export const useToastStore = create<ToastStore>((set) => {
  const show = (feedback: Feedback, durationMs: number) => {
    clearTimeout(dismissTimer);
    set({ feedback });
    dismissTimer = setTimeout(() => set({ feedback: null }), durationMs);
  };

  return {
    feedback: null,
    showToast: (type, message) =>
      show({ kind: "toast", type, message }, TOAST_DURATION_MS),
    showSnackbar: (message, onUndo) =>
      show({ kind: "snackbar", message, onUndo }, SNACKBAR_DURATION_MS),
    dismiss: () => {
      clearTimeout(dismissTimer);
      set({ feedback: null });
    },
  };
});
