// Expo SDK 58 iOS는 SceneDelegate가 URL을 받는데, @react-native-seoul/kakao-login 플러그인은
// AppDelegate에만 처리 코드를 넣어서 카카오톡 로그인이 끝나지 않는다.
// 라이브러리가 고쳐지면 지운다: https://github.com/crossplatformkorea/react-native-kakao-login/issues/445
const fs = require("node:fs");
const path = require("node:path");
const { withDangerousMod } = require("expo/config-plugins");

const MARKER = "// @kakao-scene-delegate";
const IMPORT_ANCHOR = "internal import Expo";
const CLASS_ANCHOR = "class SceneDelegate: ExpoAppSceneDelegate {";

const OPEN_URL_CODE = `
  ${MARKER}
  override func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    let others = URLContexts.filter { context in
      guard AuthApi.isKakaoTalkLoginUrl(context.url) else { return true }
      _ = AuthController.handleOpenUrl(url: context.url)
      return false
    }
    if !others.isEmpty {
      super.scene(scene, openURLContexts: others)
    }
  }`;

const withKakaoSceneDelegate = (config) =>
  withDangerousMod(config, [
    "ios",
    (config) => {
      const file = path.join(
        config.modRequest.platformProjectRoot,
        config.modRequest.projectName,
        "SceneDelegate.swift"
      );
      let contents = fs.readFileSync(file, "utf8");
      if (contents.includes(MARKER)) return config;

      if (
        !contents.includes(IMPORT_ANCHOR) ||
        !contents.includes(CLASS_ANCHOR)
      ) {
        throw new Error(
          `withKakaoSceneDelegate: ${file}에서 삽입 위치를 찾지 못했습니다. SceneDelegate 템플릿이 바뀌었는지 확인하세요.`
        );
      }
      contents = contents
        .replace(
          IMPORT_ANCHOR,
          `${IMPORT_ANCHOR}\nimport KakaoSDKAuth\nimport UIKit`
        )
        .replace(CLASS_ANCHOR, `${CLASS_ANCHOR}${OPEN_URL_CODE}`);
      fs.writeFileSync(file, contents);
      return config;
    },
  ]);

module.exports = withKakaoSceneDelegate;
