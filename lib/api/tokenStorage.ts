import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

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

async function readTokens(): Promise<AuthTokens | null> {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      storage.get(ACCESS_TOKEN_KEY),
      storage.get(REFRESH_TOKEN_KEY),
    ]);
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  } catch {
    // 저장소를 못 읽으면 로그인 안 된 걸로 본다
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

export async function saveTokens(tokens: AuthTokens) {
  cachedTokens = tokens;
  await Promise.all([
    storage.set(ACCESS_TOKEN_KEY, tokens.accessToken),
    storage.set(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

export async function clearTokens() {
  cachedTokens = null;
  await Promise.all([
    storage.remove(ACCESS_TOKEN_KEY),
    storage.remove(REFRESH_TOKEN_KEY),
  ]);
}
