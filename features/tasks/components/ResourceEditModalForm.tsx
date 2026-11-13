import { useState } from "react";

import { ResourceEditModalContent } from "./ResourceEditModalContent";

export type ResourceEditModalFormProps = {
  /** 처음 채워 둘 이름 */
  initialName: string;
  /** 처음 채워 둘 경로 */
  initialPath: string;
  /** `저장`을 눌렀을 때 입력한 값을 넘긴다. */
  onSave: (name: string, path: string) => void;
};

export function ResourceEditModalForm({
  initialName,
  initialPath,
  onSave,
}: ResourceEditModalFormProps) {
  const [name, setName] = useState(initialName);
  const [path, setPath] = useState(initialPath);

  return (
    <ResourceEditModalContent
      fileName={name}
      onChangeFileName={setName}
      filePath={path}
      onChangeFilePath={setPath}
      onSave={() => onSave(name, path)}
    />
  );
}
