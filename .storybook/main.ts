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
    const svgWebPath = path.resolve(
      dirname,
      "../node_modules/react-native-svg/lib/module/ReactNativeSVG.web.js"
    );

    // Vite 개발 서버의 의존성 최적화와 프로덕션 빌드 모두에서 RN의
    // CJS/ESM 혼합 registry 대신 react-native-web의 ESM registry를 사용한다.
    viteConfig.resolve ??= {};
    viteConfig.resolve.alias = [
      {
        find: /^@react-native\/assets-registry\/registry$/,
        replacement: assetRegistryPath,
      },
      { find: /^react-native-svg$/, replacement: svgWebPath },
      ...(Array.isArray(viteConfig.resolve.alias)
        ? viteConfig.resolve.alias
        : Object.entries(viteConfig.resolve.alias ?? {}).map(
            ([find, replacement]) => ({ find, replacement })
          )),
    ];
    viteConfig.optimizeDeps ??= {};
    viteConfig.optimizeDeps.exclude = [
      ...(viteConfig.optimizeDeps.exclude ?? []),
      "expo-modules-core",
    ];
    viteConfig.optimizeDeps.esbuildOptions ??= {};
    viteConfig.optimizeDeps.esbuildOptions.plugins ??= [];
    viteConfig.optimizeDeps.esbuildOptions.plugins.push({
      name: "stub-svg-android-sound",
      setup(build) {
        // SVG 웹 구현에도 남아 있는 Android 전용 require를 사전 번들링에서 제거한다.
        build.onResolve(
          { filter: /^\.\.\/fabric\/NativeSvgSoundModule$/ },
          () => ({ path: "svg-android-sound", namespace: "storybook" })
        );
        build.onLoad(
          { filter: /^svg-android-sound$/, namespace: "storybook" },
          () => ({ contents: "export default {}", loader: "js" })
        );
      },
    });
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
