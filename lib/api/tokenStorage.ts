import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// access/refresh 를 한 레코드(JSON)로 저장한다. 따로 저장하면 하나만 써졌을 때 다른 계정 토큰끼리 섞일 수 있다
const TOKENS_KEY = "authTokens";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type KeyValueStorage = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

// SecureStore는 웹을 지원하지 않아서 웹(개발 확인용)은 localStorage에 둔다
const storage: KeyValueStorage =
  Platform.OS === "web"
    ? {
        get: async (key) =>
          typeof localStorage === "undefined"
            ? null
            : localStorage.getItem(key),
        set: async (key, value) => localStorage.setItem(key, value),
        remove: async (key) => localStorage.removeItem(key),
      }
    : {
        get: (key) => SecureStore.getItemAsync(key),
        set: (key, value) => SecureStore.setItemAsync(key, value),
        remove: (key) => SecureStore.deleteItemAsync(key),
      };

// 요청마다 저장소를 읽지 않게 메모리에 들고 있는다 (undefined = 아직 안 읽음)
let cachedTokens: AuthTokens | null | undefined;

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
    if (cachedTokens === undefined) cachedTokens = stored;
  }
  return cachedTokens;
}

// 저장이 성공한 뒤에 메모리를 바꾼다. 실패하면 이전 세션을 그대로 둔다
export async function saveTokens(tokens: AuthTokens) {
  await storage.set(TOKENS_KEY, JSON.stringify(tokens));
  cachedTokens = tokens;
}

export async function clearTokens() {
  // 삭제는 실패해도 이 앱에서는 로그아웃 상태로 본다
  cachedTokens = null;
  await storage.remove(TOKENS_KEY);
}
