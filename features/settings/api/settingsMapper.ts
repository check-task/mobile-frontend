import type { ImagePickerAsset } from "expo-image-picker";
import { Platform } from "react-native";

import { toFolderColor } from "@/lib/folderColor";
import type { MyInfoResponse } from "@/types/user.types";

import type {
  SettingsProfile,
  SettingsUser,
  UpdateProfileRequest,
} from "./settings.types";

// 서버 기본 폴더. 화면은 맨 위에 고정해서 따로 그린다
const UNASSIGNED_FOLDER_TITLE = "지정안함";

export function toSettingsUser(data: MyInfoResponse): SettingsUser {
  return {
    nickname: data.nickname,
    phoneNum: data.phoneNum ?? "",
    email: data.email ?? "",
    profileImage: data.profileImage,
    loginType: data.loginType,
    deadlineAlarm: data.deadlineAlarm,
    taskAlarm: data.taskAlarm,
    folders: data.folders
      .filter((folder) => folder.folderTitle !== UNASSIGNED_FOLDER_TITLE)
      .map((folder) => ({
        id: folder.folderId,
        name: folder.folderTitle,
        color: toFolderColor(folder.color),
      })),
  };
}

/** 바뀐 필드만 담는다. 사진은 새로 골랐을 때만 보낸다 */
export function toUpdateProfileRequest(
  initial: SettingsProfile,
  profile: SettingsProfile,
  photo: ImagePickerAsset | null
): UpdateProfileRequest {
  return {
    ...(profile.nickname !== initial.nickname && {
      nickname: profile.nickname,
    }),
    ...(profile.phoneNum !== initial.phoneNum && {
      phoneNum: profile.phoneNum,
    }),
    // web 은 File 객체, native 는 uri 파트로 보낸다
    ...(photo && {
      image:
        Platform.OS === "web" && photo.file
          ? photo.file
          : {
              uri: photo.uri,
              name: photo.fileName ?? "profile.jpg",
              type: photo.mimeType ?? "image/jpeg",
            },
    }),
  };
}
