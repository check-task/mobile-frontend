import type { ReactNode } from "react";
import { create } from "zustand";

import type { ModalHeaderIcon } from "@/components/common/Modal/Modal";

export type ModalOptions = {
  title: string;
  children: ReactNode;
  headerIcon?: ModalHeaderIcon;
  onHeaderIconPress?: () => void;
  className?: string;
};

export type ModalStore = {
  modal: ModalOptions | null;
  openModal: (modal: ModalOptions) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
