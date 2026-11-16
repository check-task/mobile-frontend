export type ApiSuccess<T> = {
  resultType: "SUCCESS";
  message: string;
  data: T;
};

export type ApiFailure = {
  resultType: "FAIL";
  code?: number;
  errorCode?: string;
  reason?: string;
  /** 일부 API(예: 과제 마감일 변경)는 실패 내용을 error 로 감싸서 준다 */
  error?: { errorCode: string; reason: string };
  data: null;
};

/** Reference(자료) API 전용 envelope. 실패도 같은 형식에 isSuccess: false 로 온다고 가정한다. */
export type ReferenceApiResponse<T> = {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: T;
};

export type ApiEnvelope<T> =
  ApiSuccess<T> | ApiFailure | ReferenceApiResponse<T>;
