import { useRef } from "react";

import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";
import { formatShortDate } from "@/lib/dueDate";

import type { ResourceDraft } from "../api/taskForm.types";
import {
  type MeetingLogDraft,
  MeetingLogModalForm,
} from "../components/MeetingLogModalForm";
import { ResourceAddModalForm } from "../components/ResourceAddModalForm";
import { ResourceEditModalForm } from "../components/ResourceEditModalForm";

export type NameUrl = { name: string; url: string };

const EMPTY_MEETING_LOG: MeetingLogDraft = {
  agenda: "",
  conclusion: "",
  discussion: "",
};

/** 자료·커뮤니케이션·회의록 추가·수정·삭제 모달. 저장은 넘겨받은 요청으로 하고 실패하면 토스트를 띄운다. */
export function useResourceModals() {
  const { openModal, closeModal } = useModal();
  const { showToast, showSnackbar } = useToast();
  const meetingLogRef = useRef<MeetingLogDraft>(EMPTY_MEETING_LOG);
  const savingRef = useRef(false);

  // 성공해야 모달을 닫는다. 실패하면 모달과 입력값이 그대로 남아 다시 저장할 수 있다. 저장 중에는 다시 보내지 않는다.
  const run = (
    request: () => Promise<unknown>,
    failMessage: string,
    doneMessage?: string
  ) => {
    if (savingRef.current) {
      return;
    }
    savingRef.current = true;
    request()
      .then(() => {
        closeModal();
        if (doneMessage) showSnackbar(doneMessage);
      })
      .catch((error: unknown) =>
        showToast("fail", getErrorMessage(error, failMessage))
      )
      .finally(() => {
        savingRef.current = false;
      });
  };

  const openReference = (
    submit: (draft: ResourceDraft) => Promise<unknown>,
    initialValue?: ResourceDraft
  ) =>
    openModal({
      title: initialValue ? "자료 수정" : "자료 추가",
      headerIcon: "cancel",
      children: (
        <ResourceAddModalForm
          initialValue={initialValue}
          onSave={(draft) =>
            run(
              () => submit(draft),
              initialValue
                ? "자료를 수정하지 못했어요."
                : "자료를 추가하지 못했어요."
            )
          }
        />
      ),
    });

  const openCommunication = (
    submit: (value: NameUrl) => Promise<unknown>,
    initialValue?: NameUrl
  ) =>
    openModal({
      title: initialValue ? "커뮤니케이션 수정" : "커뮤니케이션 추가",
      headerIcon: "cancel",
      children: (
        <ResourceEditModalForm
          initialName={initialValue?.name ?? ""}
          initialPath={initialValue?.url ?? ""}
          nameLabel="커뮤니케이션명"
          namePlaceholder="커뮤니케이션명을 입력하세요."
          pathLabel="URL경로"
          pathPlaceholder="URL을 붙여넣으세요."
          onSave={(name, url) => {
            if (name.trim().length === 0 || url.trim().length === 0) {
              showToast("fail", "커뮤니케이션명과 URL을 입력해 주세요.");
              return;
            }
            run(
              () => submit({ name: name.trim(), url: url.trim() }),
              initialValue
                ? "커뮤니케이션을 수정하지 못했어요."
                : "커뮤니케이션을 추가하지 못했어요."
            );
          }}
        />
      ),
    });

  const openMeetingLog = (
    date: Date,
    submit: (value: MeetingLogDraft) => Promise<unknown>,
    initialValue?: MeetingLogDraft
  ) => {
    meetingLogRef.current = initialValue ?? EMPTY_MEETING_LOG;
    openModal({
      title: `${formatShortDate(date).slice(3)} 회의록`,
      headerIcon: "check",
      onHeaderIconPress: () => {
        const value = meetingLogRef.current;
        if (value.agenda.trim().length === 0) {
          showToast("fail", "회의 안건을 입력해 주세요.");
          return;
        }
        run(
          () =>
            submit({
              agenda: value.agenda.trim(),
              conclusion: value.conclusion.trim(),
              discussion: value.discussion.trim(),
            }),
          initialValue
            ? "회의록을 수정하지 못했어요."
            : "회의록을 추가하지 못했어요."
        );
      },
      children: (
        <MeetingLogModalForm
          initialValue={initialValue}
          valueRef={meetingLogRef}
        />
      ),
    });
  };

  const confirmDelete = (
    label: string,
    name: string,
    submit: () => Promise<unknown>
  ) =>
    openModal({
      title: `${label} 삭제`,
      children: (
        <DeleteConfirmModalContent
          targetName={name}
          description="삭제된 자료는 영구 삭제되며, 복구할 수 없습니다."
          cancelFirst
          onConfirm={() =>
            run(
              submit,
              `${label}을(를) 삭제하지 못했어요.`,
              `${name}이 삭제되었습니다`
            )
          }
          onCancel={closeModal}
        />
      ),
    });

  return { openReference, openCommunication, openMeetingLog, confirmDelete };
}
