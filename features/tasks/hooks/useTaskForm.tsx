import { type Dispatch, type SetStateAction, useRef, useState } from "react";

import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { type DueDate, toDueDateTime } from "@/lib/dueDate";

import { ResourceAddModalForm } from "../components/ResourceAddModalForm";
import type {
  ResourceDraftItem,
  SubTaskDraft,
  TaskFormValue,
} from "../api/taskForm.types";

/** 과제 등록·수정 폼의 입력 상태와 핸들러. `isEdit` 이면 개별 삭제에 `되돌리기` 스낵바를 띄운다. */
export function useTaskForm(initialValue: TaskFormValue, isEdit: boolean) {
  const { openModal, closeModal } = useModal();
  const { showSnackbar, dismiss } = useToast();
  const nextId = useRef(0);

  const [isTeam, setIsTeam] = useState(initialValue.isTeam);
  // 팀 → 개인은 되돌릴 수 없다. 저장 도중 팀으로 전환돼 다시 불러온 값이 팀이면 폼도 팀으로 맞춘다
  if (initialValue.isTeam && !isTeam) {
    setIsTeam(true);
  }
  // shortcut: 사양에 없는 Figma 옵션이라 상태만 둔다, 웬투밋 범위 정해지면 연결
  const [withWhen2meet, setWithWhen2meet] = useState(false);
  const [title, setTitle] = useState(initialValue.title);
  const [folderId, setFolderId] = useState(initialValue.folderId);
  const [deadline, setDeadline] = useState(initialValue.deadline);
  const [subTasks, setSubTasks] = useState(initialValue.subTasks);
  const [resources, setResources] = useState(initialValue.resources);

  const newId = () => `new-${nextId.current++}`;

  const removeWithUndo = <T extends { id: string }>(
    list: readonly T[],
    setList: Dispatch<SetStateAction<T[]>>,
    target: T,
    label: string
  ) => {
    const index = list.findIndex((item) => item.id === target.id);
    setList((current) => current.filter((item) => item.id !== target.id));
    if (!isEdit) return;
    showSnackbar(`${label}이 삭제되었습니다`, () =>
      setList((current) => [
        ...current.slice(0, index),
        target,
        ...current.slice(index),
      ])
    );
  };

  const changeDeadline = (next: DueDate | null) => {
    setDeadline(next);
    if (!next) return;
    // 새 과제 마감 시각을 넘는 세부 과제는 마감일을 비운다. 시간 없는 세부 과제는 자정이라 당일이면 유지된다.
    const limit = toDueDateTime(next);
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.dueDate && subTask.dueDate.date > limit
          ? { ...subTask, dueDate: null }
          : subTask
      )
    );
  };

  const updateSubTask = (id: string, patch: Partial<SubTaskDraft>) => {
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.id === id ? { ...subTask, ...patch } : subTask
      )
    );
  };

  const addSubTask = () => {
    setSubTasks((current) => [
      ...current,
      { id: newId(), title: "", dueDate: null },
    ]);
  };

  const removeSubTask = (target: SubTaskDraft) =>
    removeWithUndo(subTasks, setSubTasks, target, target.title || "TASK");

  const removeResource = (target: ResourceDraftItem) =>
    removeWithUndo(resources, setResources, target, target.name || target.path);

  const confirmRemoveAllSubTasks = () => {
    openModal({
      title: "TASK 삭제",
      children: (
        <DeleteConfirmModalContent
          heading="모든 세부과제를 삭제하시겠습니까?"
          description="삭제된 과제는 영구 삭제되며, 복구할 수 없습니다."
          onConfirm={() => {
            setSubTasks([]);
            // 앞서 지운 TASK 의 되돌리기가 남아 있으면 빈 목록에 하나만 되살아나므로 닫는다
            dismiss();
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const openResourceModal = (target?: ResourceDraftItem) => {
    openModal({
      title: target ? "자료 수정" : "자료 추가",
      headerIcon: "cancel",
      children: (
        <ResourceAddModalForm
          initialValue={target}
          onSave={(value) => {
            setResources((current) =>
              target
                ? current.map((item) =>
                    item.id === target.id ? { ...item, ...value } : item
                  )
                : [...current, { ...value, id: newId() }]
            );
            closeModal();
          }}
        />
      ),
    });
  };

  const value: TaskFormValue = {
    isTeam,
    title,
    folderId,
    deadline,
    subTasks,
    resources,
  };

  return {
    value,
    withWhen2meet,
    toggleTeam: () => setIsTeam(!isTeam),
    toggleWhen2meet: () => setWithWhen2meet(!withWhen2meet),
    setTitle,
    // 다시 누르면 선택 해제 → folderId 생략(미지정)
    toggleFolder: (id: number) => setFolderId(id === folderId ? null : id),
    changeDeadline,
    updateSubTask,
    addSubTask,
    removeSubTask,
    removeResource,
    confirmRemoveAllSubTasks,
    openResourceModal,
  };
}
