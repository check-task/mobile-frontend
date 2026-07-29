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
        bg: {
          DEFAULT: "rgb(var(--color-bg) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
        },
        "primary-button-text": {
          DEFAULT: "rgb(var(--color-primary-button-text) / <alpha-value>)",
        },
        blue: {
          50: {
            DEFAULT: "rgb(var(--color-blue-50) / <alpha-value>)",
          },
          100: {
            DEFAULT: "rgb(var(--color-blue-100) / <alpha-value>)",
          },
          200: {
            DEFAULT: "rgb(var(--color-blue-200) / <alpha-value>)",
          },
          300: {
            DEFAULT: "rgb(var(--color-blue-300) / <alpha-value>)",
          },
          500: {
            DEFAULT: "rgb(var(--color-blue-500) / <alpha-value>)",
          },
          600: {
            DEFAULT: "rgb(var(--color-blue-600) / <alpha-value>)",
          },
          700: {
            DEFAULT: "rgb(var(--color-blue-700) / <alpha-value>)",
          },
        },
        sub: {
          "01": {
            DEFAULT: "rgb(var(--color-sub-01) / <alpha-value>)",
          },
          "02": {
            DEFAULT: "rgb(var(--color-sub-02) / <alpha-value>)",
          },
          "03": {
            DEFAULT: "rgb(var(--color-sub-03) / <alpha-value>)",
          },
          "04": {
            DEFAULT: "rgb(var(--color-sub-04) / <alpha-value>)",
          },
          "05": {
            DEFAULT: "rgb(var(--color-sub-05) / <alpha-value>)",
          },
          null: {
            DEFAULT: "rgb(var(--color-sub-null) / <alpha-value>)",
          },
        },
        gray: {
          0: {
            DEFAULT: "rgb(var(--color-gray-0) / <alpha-value>)",
          },
          100: {
            DEFAULT: "rgb(var(--color-gray-100) / <alpha-value>)",
          },
          200: {
            DEFAULT: "rgb(var(--color-gray-200) / <alpha-value>)",
          },
          300: {
            DEFAULT: "rgb(var(--color-gray-300) / <alpha-value>)",
          },
          400: {
            DEFAULT: "rgb(var(--color-gray-400) / <alpha-value>)",
          },
          500: {
            DEFAULT: "rgb(var(--color-gray-500) / <alpha-value>)",
          },
          600: {
            DEFAULT: "rgb(var(--color-gray-600) / <alpha-value>)",
          },
          700: {
            DEFAULT: "rgb(var(--color-gray-700) / <alpha-value>)",
          },
          800: {
            DEFAULT: "rgb(var(--color-gray-800) / <alpha-value>)",
          },
          900: {
            DEFAULT: "rgb(var(--color-gray-900) / <alpha-value>)",
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss/plugin")(function ({ addBase, addUtilities }) {
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

      addBase({
        ":root": {
          "--color-bg": "252 252 253",
          "--color-primary": "49 122 228",
          "--color-primary-button-text": "255 255 255",
          "--color-blue-50": "243 246 252",
          "--color-blue-100": "226 236 251",
          "--color-blue-200": "183 208 246",
          "--color-blue-300": "116 164 237",
          "--color-blue-500": "49 122 228",
          "--color-blue-600": "50 82 121",
          "--color-blue-700": "41 55 71",
          "--color-sub-01": "245 87 87",
          "--color-sub-02": "255 201 63",
          "--color-sub-03": "110 199 123",
          "--color-sub-04": "161 119 226",
          "--color-sub-05": "8 18 33",
          "--color-sub-null": "129 136 146",
          "--color-gray-0": "255 255 255",
          "--color-gray-100": "238 239 241",
          "--color-gray-200": "211 214 217",
          "--color-gray-300": "183 188 194",
          "--color-gray-400": "156 162 171",
          "--color-gray-500": "128 136 147",
          "--color-gray-600": "80 85 94",
          "--color-gray-700": "56 60 66",
          "--color-gray-800": "33 35 39",
          "--color-gray-900": "9 10 11",
        },
      });

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
