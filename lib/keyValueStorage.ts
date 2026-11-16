import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type KeyValueStorage = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

// SecureStore는 웹을 지원하지 않아서 웹(개발 확인용)은 localStorage에 둔다
export const keyValueStorage: KeyValueStorage =
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
