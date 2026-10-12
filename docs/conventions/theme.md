# 테마 토큰 규칙

NativeWind 4 + Tailwind 3에서 색상은 CSS 변수 기반 토큰으로 관리한다. 모든 토큰은 라이트/다크 값이 따로 있어 다크모드에서 자동으로 바뀐다.
(참고: [NativeWind Themes](https://www.nativewind.dev/docs/guides/themes), [vars() API](https://www.nativewind.dev/docs/api/vars))

## 구조

| 역할   | 위치                                                                      |
| ------ | ------------------------------------------------------------------------- |
| 값     | `constants/theme-vars.ts`의 `themeVars.light` / `themeVars.dark`          |
| 클래스 | `tailwind.config.js`의 `colors`에서 `rgb(var(--color-x) / <alpha-value>)` |
| 주입   | `app/_layout.tsx` 최상위 `View`의 `style={themeVars[scheme]}`             |

토큰 이름은 의미 기반(`bg`, `primary`, `primary-button-text`)과 팔레트(`blue-*`, `gray-*`, `sub-*`)가 함께 있다. 팔레트 토큰도 CSS 변수이므로 화면 코드에서 사용해도 된다.

## 토큰 추가 금지

- `constants/theme-vars.ts`와 `tailwind.config.js`의 색상 토큰을 추가하거나 값을 바꾸지 않는다.
- 필요한 색에 맞는 토큰이 없으면 임의로 비슷한 토큰을 고르거나 새로 만들지 말고, 어떤 색이 필요한지 사용자에게 확인한다.

## JS 값으로 색이 필요할 때

`tabBarActiveTintColor`처럼 className을 쓸 수 없는 곳은 `themeVars`와 같은 값에서 파생시킨다. 값을 따로 하드코딩하지 않는다.
