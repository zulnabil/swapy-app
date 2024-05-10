import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: "full",
  },
  variants: {
    solid: {
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
});
