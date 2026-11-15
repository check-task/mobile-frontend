export type ApiSuccess<T> = {
  resultType: "SUCCESS";
  message: string;
  data: T;
};

export type ApiFailure = {
  resultType: "FAIL";
  code: number;
  errorCode: string;
  reason: string;
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
