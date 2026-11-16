import { useModalStore } from "@/store/modalStore";

export function useModal() {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const closeModalIf = useModalStore((state) => state.closeModalIf);
  const getCurrentModal = () => useModalStore.getState().modal;

  return { openModal, closeModal, closeModalIf, getCurrentModal };
}
