"use client"

import {
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"

interface Props {
  name: string
  label?: string
  rightText?: string
  chainElement?: React.ReactNode
  tokenElement?: React.ReactNode
}

export default function SwapInput({
  name,
  label = "You pay",
  rightText,
  chainElement,
  tokenElement,
}: Props) {
  return (
    <VStack p="4" bg="brand.bgInput" rounded="lg" align="flex-start">
      {chainElement}
      <Flex justify="space-between" align="center" color="gray.500" w="full">
        <Text fontWeight="regular" fontSize="sm" id={name}>
          {label}
        </Text>
        <Text fontSize="xs">{rightText}</Text>
      </Flex>
      <Flex justify="space-between" align="center" gap="3" w="full">
        <Input
          name={name}
          placeholder="0.0"
          variant="unstyled"
          fontSize="2xl"
          type="number"
        />
        {tokenElement}
      </Flex>
    </VStack>
  )
}
