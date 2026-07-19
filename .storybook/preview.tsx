import type { Preview } from "@storybook/react-native-web-vite";

import "../global.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        mobile375: {
          name: "Mobile (375px)",
          styles: { width: "375px", height: "812px" },
          type: "mobile",
        },
        mobile430: {
          name: "Mobile (430px)",
          styles: { width: "430px", height: "932px" },
          type: "mobile",
        },
      },
    },
  },
};

export default preview;
