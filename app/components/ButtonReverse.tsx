"use client";

import { ArrowDownIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export default function ButtonReverse() {
  return (
    <IconButton
      aria-label="btn-reverse"
      colorScheme="brand"
      variant="solid"
      size="lg"
      _hover={{
        bg: "brand.600",
        transform: "rotate(180deg)",
      }}
    >
      <ArrowDownIcon boxSize={5} />
    </IconButton>
  );
}
