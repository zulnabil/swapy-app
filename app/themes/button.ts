import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: "bold",
    borderRadius: "full",
  },
  variants: {
    solid: {
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
});
