/* theme.ts */
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#ede6ff",
      200: "#c6b6ff",
      300: "#a086fa",
      400: "#7a56f7",
      500: "#5326f3",
      600: "#3a0cd9",
      700: "#2c08aa",
      800: "#1f067b",
      900: "#11034b",
      bg: "#F5F3F4",
      bgInput: "#F4F8FA",
    },
  },
  components: {
    Button,
  },
  fonts: {
    heading: "var(--font-rubik)",
    body: "var(--font-rubik)",
  },
});
