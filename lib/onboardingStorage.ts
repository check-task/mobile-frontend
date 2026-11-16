import { keyValueStorage } from "@/lib/keyValueStorage";

const SEEN_KEY = "hasSeenOnboarding";

// undefined = 아직 저장소를 안 읽음
let hasSeen: boolean | undefined;
let loading: Promise<void> | null = null;

const listeners = new Set<() => void>();

function setHasSeen(value: boolean) {
  hasSeen = value;
  listeners.forEach((listener) => listener());
}

export function subscribeOnboardingSeen(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getOnboardingSeen() {
  return hasSeen;
}

/** 앱 시작 시 한 번 저장값을 읽는다 */
export function loadOnboardingSeen() {
  loading ??= keyValueStorage
    .get(SEEN_KEY)
    .catch(() => null)
    .then((stored) => {
      // 읽는 사이 온보딩을 끝냈으면 그 값을 둔다
      if (hasSeen === undefined) setHasSeen(stored === "true");
    });
  return loading;
}

/** 온보딩을 끝냈다고 저장한다. 저장에 실패해도 이번 실행 동안은 다시 안 보여준다 */
export function markOnboardingSeen() {
  setHasSeen(true);
  keyValueStorage.set(SEEN_KEY, "true").catch(() => {});
}
