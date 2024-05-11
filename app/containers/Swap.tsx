"use client"

import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons"
import {
  Button,
  Divider,
  Flex,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useState } from "react"
import SwapInput from "~/app/components/SwapInput"
import ButtonReverse from "~/app/components/ButtonReverse"
import ChainSelector from "~/app/containers/ChainSelector"

export default function Swap() {
  const [mode, setMode] = useState<"swap" | "buy">("swap")
  return (
    <Stack spacing="5" w="full" bg="white" maxW="lg" rounded="2xl" p="8">
      {/* Header */}
      <Flex justify="space-between">
        <Flex gap="4">
          <Button
            color={mode === "swap" ? "gray.600" : "gray.300"}
            fontWeight="medium"
            variant="link"
            onClick={() => setMode("swap")}
          >
            Swap
          </Button>
          <Button
            color={mode === "buy" ? "gray.600" : "gray.300"}
            fontWeight="medium"
            variant="link"
            onClick={() => setMode("buy")}
          >
            Buy
          </Button>
        </Flex>
        <IconButton aria-label="btn-setting" bg="transparent">
          <SettingsIcon color="gray.600" boxSize={6} />
        </IconButton>
      </Flex>

      {/* Swap Entities */}
      <SwapInput
        name="from"
        rightText="Balance: 1.17 BTC"
        chainElement={<ChainSelector />}
        tokenElement={
          <Button
            variant="outline"
            size="sm"
            fontWeight="medium"
            rightIcon={<ChevronDownIcon />}
          >
            BTC
          </Button>
        }
      />

      <Flex mt="-9" mb="-9" justify="center">
        <ButtonReverse />
      </Flex>

      <SwapInput
        name="to"
        label="You get"
        rightText="≈ $1,000.00"
        chainElement={<ChainSelector defaultChainId={421613} />}
        tokenElement={
          <Button
            variant="outline"
            size="sm"
            fontWeight="medium"
            rightIcon={<ChevronDownIcon />}
          >
            ETH
          </Button>
        }
      />

      <Divider color="gray.200" />

      {/* Swap Information */}
      <Stack spacing="3" mb="3" fontSize="sm" color="gray.500">
        <Flex justify="space-between">
          <Text>Exchange Rate</Text>
          <Text color="brand.500" fontWeight="medium">
            1 BTC ≈ 16.02 ETH
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text>Network Fee</Text>
          <Text color="gray.600">$0.25</Text>
        </Flex>
        <Flex justify="space-between">
          <Text>Price Impact</Text>
          <Text color="gray.600">1.5%</Text>
        </Flex>
      </Stack>

      {/* Swap Button */}
      <Button colorScheme="brand" size="lg" fontWeight="bold" w="full">
        Swap
      </Button>
    </Stack>
  )
}
