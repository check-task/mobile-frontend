import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-native-web-vite";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../features/**/*.stories.@(js|jsx|ts|tsx)",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-docs"],
  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      pluginReactOptions: {
        jsxImportSource: "nativewind",
      },
    },
  },
  async viteFinal(viteConfig) {
    const doctorStubPath = path.resolve(
      dirname,
      "./stubs/react-native-css-interop-doctor.ts"
    );

    viteConfig.plugins ??= [];
    viteConfig.plugins.unshift({
      name: "stub-react-native-css-interop-doctor",
      enforce: "pre",
      // `react-native-css-interop/dist/doctor.js`는 CLI 진단용
      // (`verifyInstallation`) 코드지만 Vite 프로덕션 빌드에서
      // CJS/ESM 상호운용 실패로 "exports is not defined" 런타임
      // 에러를 일으킨다. 스토리 렌더링에는 필요 없으므로 상대 경로
      // "./doctor" import를 스텁으로 치환한다.
      resolveId(source, importer) {
        if (
          source === "./doctor" &&
          importer?.includes("react-native-css-interop")
        ) {
          return doctorStubPath;
        }
        return null;
      },
    });

    return viteConfig;
  },
};

export default config;
