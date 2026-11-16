import { keyValueStorage as storage } from "@/lib/keyValueStorage";

// access/refresh 를 한 레코드(JSON)로 저장한다. 따로 저장하면 하나만 써졌을 때 다른 계정 토큰끼리 섞일 수 있다
const TOKENS_KEY = "authTokens";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

// 요청마다 저장소를 읽지 않게 메모리에 들고 있는다 (undefined = 아직 안 읽음)
let cachedTokens: AuthTokens | null | undefined;

// 로그인 여부로 화면을 막는 곳(app/_layout)이 토큰이 바뀐 걸 알 수 있게 알린다
const listeners = new Set<() => void>();

function setCachedTokens(tokens: AuthTokens | null) {
  cachedTokens = tokens;
  listeners.forEach((listener) => listener());
}

export function subscribeTokens(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** 메모리에 있는 토큰. 아직 저장소를 안 읽었으면 undefined */
export function getCachedTokens() {
  return cachedTokens;
}

function isAuthTokens(value: unknown): value is AuthTokens {
  if (typeof value !== "object" || value === null) return false;
  const { accessToken, refreshToken } = value as Record<string, unknown>;
  return (
    typeof accessToken === "string" &&
    accessToken.length > 0 &&
    typeof refreshToken === "string" &&
    refreshToken.length > 0
  );
}

async function readTokens(): Promise<AuthTokens | null> {
  try {
    const stored = await storage.get(TOKENS_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return isAuthTokens(parsed) ? parsed : null;
  } catch {
    // 저장소를 못 읽거나 값이 깨졌으면 로그인 안 된 걸로 본다
    return null;
  }
}

export async function getTokens() {
  if (cachedTokens === undefined) {
    const stored = await readTokens();
    // 읽는 동안 저장/삭제가 먼저 끝났으면 그 값을 쓴다
    if (cachedTokens === undefined) setCachedTokens(stored);
  }
  return cachedTokens;
}

// 저장·삭제를 부른 순서대로 저장소에 쓴다. 저장 중에 로그아웃해도 삭제가 그 뒤에 실행된다
let writeQueue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>) {
  const run = writeQueue.then(task, task);
  writeQueue = run.catch(() => undefined);
  return run;
}

// 삭제할 때마다 올린다. 삭제 전에 시작한 저장이 늦게 끝나도 이전 토큰으로 되돌리지 않게 한다
let clearCount = 0;

// 저장이 성공한 뒤에 메모리를 바꾼다. 실패하면 이전 세션을 그대로 둔다
export function saveTokens(tokens: AuthTokens) {
  const clearCountAtStart = clearCount;
  return enqueue(async () => {
    // 차례를 기다리는 동안 로그아웃했으면 저장하지 않는다
    if (clearCount !== clearCountAtStart) return;
    await storage.set(TOKENS_KEY, JSON.stringify(tokens));
    if (clearCount === clearCountAtStart) setCachedTokens(tokens);
  });
}

export function clearTokens() {
  clearCount += 1;
  // 삭제는 실패해도 이 앱에서는 로그아웃 상태로 본다
  setCachedTokens(null);
  return enqueue(() => storage.remove(TOKENS_KEY));
}
