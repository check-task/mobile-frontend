import { Modal } from "@/components/common/Modal/Modal";
import { useModalStore } from "@/store/modalStore";

export function ModalProvider() {
  const modal = useModalStore((state) => state.modal);
  const closeModal = useModalStore((state) => state.closeModal);

  return modal ? (
    <Modal
      title={modal.title}
      onClose={closeModal}
      headerIcon={modal.headerIcon}
      onHeaderIconPress={modal.onHeaderIconPress}
      className={modal.className}
    >
      {modal.children}
    </Modal>
  ) : null;
}
