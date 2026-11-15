export class ApiError extends Error {
  /** HTTP 상태 코드. 네트워크 오류처럼 응답이 없으면 0 */
  readonly status: number;
  /** 서버 에러 코드 (예: TOKEN_NOT_FOUND). 응답이 없으면 null */
  readonly errorCode: string | null;
  /** 사용자에게 보여줄 수 있는 서버 메시지 */
  readonly reason: string;

  constructor(status: number, errorCode: string | null, reason: string) {
    super(reason);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
    this.reason = reason;
  }
}
