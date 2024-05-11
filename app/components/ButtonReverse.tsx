"use client"

import { ArrowDownIcon } from "@chakra-ui/icons"
import { ChakraProps, IconButton, IconButtonProps } from "@chakra-ui/react"

type Props = Omit<IconButtonProps, "aria-label"> & ChakraProps

export default function ButtonReverse(props: Props) {
  return (
    <IconButton
      colorScheme="brand"
      variant="solid"
      size="lg"
      _hover={{
        bg: "brand.600",
        transform: "rotate(180deg)",
      }}
      {...props}
      aria-label="btn-reverse"
    >
      <ArrowDownIcon boxSize={5} />
    </IconButton>
  )
}
