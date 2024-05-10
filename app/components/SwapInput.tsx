"use client";

import { Box, Button, Flex, FormLabel, Input, Text } from "@chakra-ui/react";

interface Props {
  name: string;
  label?: string;
  rightText?: string;
  tokenElement?: React.ReactNode;
}

export default function SwapInput({
  name,
  label = "You pay",
  rightText,
  tokenElement,
}: Props) {
  return (
    <Box p="4" bg="brand.bgInput" rounded="lg">
      <Flex justify="space-between" align="center" color="gray.500">
        <FormLabel fontWeight="regular" fontSize="sm" id={name}>
          {label}
        </FormLabel>
        <Text fontSize="xs">{rightText}</Text>
      </Flex>
      <Flex justify="space-between" gap="3">
        <Input
          name={name}
          placeholder="0.0"
          variant="unstyled"
          fontSize="2xl"
          type="number"
        />
        {tokenElement}
      </Flex>
    </Box>
  );
}
