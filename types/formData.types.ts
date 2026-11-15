/** React Native FormData 가 파일 파트로 받는 객체. 웹에서는 File(Blob)을 쓴다. */
export type NativeFilePart = { uri: string; name: string; type: string };

// DOM lib 의 FormData 타입에는 RN 파일 파트 오버로드가 없어 추가한다.
declare global {
  interface FormData {
    append(name: string, value: NativeFilePart): void;
  }
}
