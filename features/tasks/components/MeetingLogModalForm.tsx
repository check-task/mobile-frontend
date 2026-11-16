import { type RefObject, useState } from "react";

import { MeetingMinutesModalContent } from "./MeetingMinutesModalContent";

export type MeetingLogDraft = {
  agenda: string;
  conclusion: string;
  discussion: string;
};

export type MeetingLogModalFormProps = {
  initialValue?: MeetingLogDraft;
  /** 저장 버튼이 모달 헤더(체크 아이콘)에 있어서, 입력값을 여기에 계속 써 둔다. */
  valueRef: RefObject<MeetingLogDraft>;
};

export function MeetingLogModalForm({
  initialValue,
  valueRef,
}: MeetingLogModalFormProps) {
  const [value, setValue] = useState<MeetingLogDraft>(
    initialValue ?? { agenda: "", conclusion: "", discussion: "" }
  );

  const change = (patch: Partial<MeetingLogDraft>) => {
    const next = { ...value, ...patch };
    valueRef.current = next;
    setValue(next);
  };

  return (
    <MeetingMinutesModalContent
      agenda={value.agenda}
      onChangeAgenda={(agenda) => change({ agenda })}
      result={value.conclusion}
      onChangeResult={(conclusion) => change({ conclusion })}
      urlPath={value.discussion}
      onChangeUrlPath={(discussion) => change({ discussion })}
    />
  );
}
