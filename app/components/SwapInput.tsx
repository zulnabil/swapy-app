"use client"

import { Flex, Input, Text, VStack } from "@chakra-ui/react"

interface Props {
  name: string
  onChange?: (value: string) => void
  label?: string
  rightText?: string
  chainElement?: React.ReactNode
  tokenElement?: React.ReactNode
  addressElement?: React.ReactNode
}

export default function SwapInput({
  name,
  onChange,
  label = "You pay",
  rightText,
  chainElement,
  tokenElement,
  addressElement,
}: Props) {
  return (
    <VStack p="4" bg="brand.bgInput" rounded="lg" align="flex-start">
      <Flex justify="space-between" align="center" w="full">
        {chainElement}
        {addressElement}
      </Flex>
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
          onChange={(event) => onChange && onChange(event.target.value)}
        />
        {tokenElement}
      </Flex>
    </VStack>
  )
}
