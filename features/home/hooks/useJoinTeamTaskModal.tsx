import { useRouter } from "expo-router";

import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";

import { JoinTeamTaskModalForm } from "../components/JoinTeamTaskModalForm";
import { useJoinTeamTaskMutation } from "./useJoinTeamTaskMutation";

/** 초대 코드로 팀 과제에 참여하는 `과제 참여` 모달. 참여하면 그 팀 과제 상세로 이동한다. */
export function useJoinTeamTaskModal() {
  const router = useRouter();
  const { openModal, closeModalIf, getCurrentModal } = useModal();
  const { showToast } = useToast();
  const { mutateAsync: joinTeamTask } = useJoinTeamTaskMutation();

  return () => {
    openModal({
      title: "과제 참여",
      headerIcon: "cancel",
      children: (
        <JoinTeamTaskModalForm
          onSubmit={async (inviteCode, folderId) => {
            // 요청 중에 이 모달을 닫고 다른 모달을 열었으면 그 모달은 닫지 않는다
            const requestModal = getCurrentModal();
            try {
              const { task_id } = await joinTeamTask({
                inviteCode,
                folderId: folderId ?? undefined,
              });
              closeModalIf(requestModal);
              router.push(`/tasks/team/${task_id}`);
            } catch (error) {
              showToast(
                "fail",
                getErrorMessage(error, "팀 과제에 참여하지 못했습니다.")
              );
            }
          }}
        />
      ),
    });
  };
}
