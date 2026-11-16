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
  /** 지금 열린 모달이 넘긴 모달과 같을 때만 닫는다. 비동기 작업이 끝난 뒤 그 사이 새로 연 모달을 닫지 않으려고 쓴다. */
  closeModalIf: (modal: ModalOptions | null) => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  closeModalIf: (modal) =>
    set((state) => (modal && state.modal === modal ? { modal: null } : state)),
}));
