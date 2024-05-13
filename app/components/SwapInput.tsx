"use client"

import {
  Flex,
  Input,
  InputProps,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react"

interface Props extends Omit<InputProps, "onChange"> {
  name: string
  isLoading?: boolean
  onChange?: (value: string) => void
  label?: React.ReactNode | string
  balanceElement?: React.ReactNode
  chainElement?: React.ReactNode
  tokenElement?: React.ReactNode
  addressElement?: React.ReactNode
}

export default function SwapInput({
  name,
  isLoading,
  onChange,
  label = "You pay",
  balanceElement,
  chainElement,
  tokenElement,
  addressElement,
  ...props
}: Props) {
  return (
    <VStack p="4" bg="brand.bgInput" rounded="lg" align="flex-start">
      <Flex justify="space-between" align="center" w="full">
        {chainElement}
        {addressElement}
      </Flex>
      <Flex justify="space-between" align="center" color="gray.500" w="full">
        <Skeleton isLoaded={!isLoading}>
          <Text fontWeight="regular" fontSize="sm" id={name}>
            {label}
          </Text>
        </Skeleton>
        {balanceElement}
      </Flex>
      <Flex justify="space-between" align="center" gap="3" w="full">
        <Skeleton isLoaded={!isLoading}>
          <Input
            name={name}
            placeholder="0.0"
            variant="unstyled"
            fontSize="2xl"
            type="number"
            onChange={(event) => onChange && onChange(event.target.value)}
            {...props}
          />
        </Skeleton>
        {tokenElement}
      </Flex>
    </VStack>
  )
}
