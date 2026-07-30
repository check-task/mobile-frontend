// `react-native-css-interop/dist/doctor.js`는 CLI 진단용(`verifyInstallation`)
// 코드이며 Storybook(Vite) 프로덕션 빌드에서 CJS/ESM 상호운용 실패로
// "exports is not defined" 런타임 에러를 일으킨다. 스토리 렌더링에는
// 필요 없는 코드이므로 빈 스텁으로 대체한다.
export function verifyJSX() {
  return true;
}

export function verifyFlag() {
  return true;
}

export function verifyData() {
  return true;
}
