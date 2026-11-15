import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "./apiError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx 는 다시 보내도 같은 결과라 재시도하지 않는다.
      retry: (failureCount, error) =>
        !(
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) && failureCount < 1,
    },
  },
});
