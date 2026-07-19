/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./stories/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#FCFCFD", dark: "#081221" },
        primary: { DEFAULT: "#317AE4", dark: "#317AE4" },
        "primary-button-text": { DEFAULT: "#FFFFFF", dark: "#FFFFFF" },
        blue: {
          50: { DEFAULT: "#F3F6FC", dark: "#293747" },
          100: { DEFAULT: "#E2ECFB", dark: "#325279" },
          200: { DEFAULT: "#B7D0F6", dark: "#317AE4" },
          300: { DEFAULT: "#74A4ED", dark: "#74A4ED" },
          500: { DEFAULT: "#317AE4", dark: "#B7D0F6" },
          600: { DEFAULT: "#325279", dark: "#E2ECFB" },
          700: { DEFAULT: "#293747", dark: "#F3F6FC" },
        },
        sub: {
          "01": { DEFAULT: "#F55757", dark: "#F55757" },
          "02": { DEFAULT: "#FFC93F", dark: "#FFC93F" },
          "03": { DEFAULT: "#6EC77B", dark: "#6EC77B" },
          "04": { DEFAULT: "#A177E2", dark: "#A177E2" },
          "05": { DEFAULT: "#081221", dark: "#B5BAC4" },
          null: { DEFAULT: "#818892", dark: "#818892" },
        },
        gray: {
          0: { DEFAULT: "#FFFFFF", dark: "#1F2935" },
          100: { DEFAULT: "#EEEFF1", dark: "#212327" },
          200: { DEFAULT: "#D3D6D9", dark: "#383C42" },
          300: { DEFAULT: "#B7BCC2", dark: "#50555E" },
          400: { DEFAULT: "#9CA2AB", dark: "#808893" },
          500: { DEFAULT: "#808893", dark: "#9CA2AB" },
          600: { DEFAULT: "#50555E", dark: "#B7BCC2" },
          700: { DEFAULT: "#383C42", dark: "#D3D6D9" },
          800: { DEFAULT: "#212327", dark: "#EEEFF1" },
          900: { DEFAULT: "#090A0B", dark: "#FFFFFF" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss/plugin")(function ({ addUtilities }) {
      const FONT_FAMILY_BY_WEIGHT = {
        400: "Inter_400Regular",
        500: "Inter_500Medium",
      };

      // [fontSize, lineHeight, letterSpacing, fontWeight]
      const TEXT_STYLES = {
        "h-01": ["24px", "36px", "-0.48px", 500],
        "h-02": ["22px", "33px", "-0.44px", 500],
        "h-03": ["20px", "30px", "-0.4px", 500],
        "h-04": ["18px", "27px", "-0.36px", 500],
        "b-01-m": ["16px", "24px", "-0.32px", 500],
        "b-01-r": ["16px", "24px", "-0.32px", 400],
        "b-02-m": ["14px", "21px", "-0.28px", 500],
        "b-02-r": ["14px", "21px", "-0.28px", 400],
        "b-03-m": ["13px", "19.5px", "-0.26px", 500],
        "b-03-r": ["13px", "19.5px", "-0.26px", 400],
        "b-04-m": ["12px", "18px", "-0.24px", 500],
        "b-04-r": ["12px", "18px", "-0.24px", 400],
        caption: ["10px", "14px", "-0.2px", 400],
        calendar: ["8px", "11.2px", "-0.16px", 400],
        "calendar-2": ["7px", "9.8px", "-0.14px", 400],
        btn: ["16px", "22.4px", "-0.32px", 500],
      };

      addUtilities(
        Object.fromEntries(
          Object.entries(TEXT_STYLES).map(
            ([name, [fontSize, lineHeight, letterSpacing, fontWeight]]) => [
              `.text-${name}`,
              {
                fontFamily: FONT_FAMILY_BY_WEIGHT[fontWeight],
                fontSize,
                lineHeight,
                letterSpacing,
                fontWeight: String(fontWeight),
              },
            ]
          )
        )
      );
    }),
  ],
};
