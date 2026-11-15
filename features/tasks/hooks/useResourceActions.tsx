import { useState } from "react";

import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";

import { ResourceEditModalForm } from "../components/ResourceEditModalForm";
import type { Resource } from "../components/ResourceSection";

export function useResourceActions(serverResources: readonly Resource[]) {
  const { openModal, closeModal } = useModal();
  const { showSnackbar } = useToast();
  const [resources, setResources] = useState(serverResources);
  const [syncedResources, setSyncedResources] = useState(serverResources);
  // 수정·삭제는 아직 서버에 저장하지 않는 화면 안 편집이다. 서버에서 새 목록이 오면 서버 목록으로 맞춘다.
  if (syncedResources !== serverResources) {
    setSyncedResources(serverResources);
    setResources(serverResources);
  }

  const editResource = (id: string) => {
    const target = resources.find((resource) => resource.id === id);
    if (!target) {
      return;
    }

    openModal({
      title: "자료 수정",
      headerIcon: "cancel",
      children: (
        <ResourceEditModalForm
          initialName={target.title}
          initialPath={target.link}
          onSave={(title, link) => {
            setResources((current) =>
              current.map((resource) =>
                resource.id === id ? { ...resource, title, link } : resource
              )
            );
            closeModal();
          }}
        />
      ),
    });
  };

  const deleteResource = (id: string) => {
    const index = resources.findIndex((resource) => resource.id === id);
    const target = resources[index];
    if (!target) {
      return;
    }

    openModal({
      title: "자료 삭제",
      children: (
        <DeleteConfirmModalContent
          targetName={target.title}
          description="삭제된 자료는 영구 삭제되며, 복구할 수 없습니다."
          cancelFirst
          onConfirm={() => {
            setResources((current) =>
              current.filter((resource) => resource.id !== id)
            );
            closeModal();
            showSnackbar(`${target.title}이 삭제되었습니다`, () =>
              setResources((current) => [
                ...current.slice(0, index),
                target,
                ...current.slice(index),
              ])
            );
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  return { resources, editResource, deleteResource };
}
