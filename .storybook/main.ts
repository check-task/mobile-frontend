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

    const assetRegistryPath = path.resolve(
      dirname,
      "../node_modules/react-native-web/dist/modules/AssetRegistry/index.js"
    );

    viteConfig.plugins ??= [];
    viteConfig.plugins.unshift({
      name: "alias-react-native-assets-registry",
      enforce: "pre",
      // `react-native-svg` 웹 코드가 import하는 `@react-native/assets-registry/registry`는
      // RN 0.88부터 ESM import와 `module.exports`를 섞어 쓰는 파일이라 Vite 빌드에서
      // "Cannot set properties of undefined (setting 'exports')" 런타임 에러를 일으킨다.
      // 같은 API를 가진 react-native-web의 ESM AssetRegistry로 바꾼다.
      resolveId(source) {
        if (source === "@react-native/assets-registry/registry") {
          return assetRegistryPath;
        }
        return null;
      },
    });
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
