"use client"

import { EditIcon, SettingsIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import SwapInput from "~/app/components/SwapInput"
import ButtonReverse from "~/app/components/ButtonReverse"
import ChainSelector from "~/app/containers/ChainSelector"
import TokenSelector from "~/app/containers/TokenSelector"
import { useMainContext } from "~/app/contexts/MainContext"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { StringHelper } from "~/app/libs/string"

export default function Swap() {
  const {
    state: { fromChain, toChain, fromToken, toToken, fromAmount, toAddress },
    dispatch,
  } = useMainContext()
  const { address, isConnected } = useWeb3ModalAccount()
  const [mode, setMode] = useState<"swap" | "buy">("swap")
  const [isReadyForRoute, setIsReadyForRoute] = useState(false)

  useEffect(() => {
    // when wallet connected, set its address to default toAddress
    if (isConnected) {
      dispatch({ type: "setState", payload: { toAddress: address } })
    }
  }, [address, dispatch, isConnected])

  function handleReverseFromTo() {
    dispatch({
      type: "setState",
      payload: {
        fromChain: toChain,
        toChain: fromChain,
        fromToken: toToken,
        toToken: fromToken,
      },
    })
  }

  // async function getRoute() {
  //   const params = {
  //     fromChain,
  //     fromToken,
  //     fromAmount,
  //     toChain,
  //     toToken,
  //     fromAddress: address,
  //     toAddress,
  //   }
  // }

  useEffect(() => {
    // get route if payload is ready
    if (fromChain && fromToken && fromAmount && toChain && toToken) {
      setIsReadyForRoute(true)
      return
    }
    setIsReadyForRoute(false)
  }, [fromAmount, fromChain, fromToken, toChain, toToken])

  function handleChangeToAddress(value: string) {
    if (!value) return
    dispatch({
      type: "setState",
      payload: { toAddress: value },
    })
  }

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
        <IconButton
          aria-label="btn-setting"
          bg="transparent"
          icon={<SettingsIcon color="gray.600" boxSize={6} />}
        />
      </Flex>

      {/* Swap Entities */}
      <SwapInput
        name="from"
        rightText="Balance: 1.17 BTC"
        chainElement={
          <ChainSelector
            selectedChainId={fromChain}
            onSelectChain={(chainId) =>
              dispatch({
                type: "setState",
                payload: { fromChain: chainId },
              })
            }
          />
        }
        tokenElement={
          <TokenSelector
            selectedChainId={fromChain}
            selectedToken={fromToken}
            onSelectToken={(token) =>
              dispatch({
                type: "setState",
                payload: { fromToken: token },
              })
            }
          />
        }
      />

      <Flex mt={["-8", "-9"]} mb={["-8", "-9"]} justify="center">
        <ButtonReverse onClick={handleReverseFromTo} />
      </Flex>

      <SwapInput
        name="to"
        label="You get"
        rightText="≈ $1,000.00"
        chainElement={
          <ChainSelector
            selectedChainId={toChain}
            onSelectChain={(chainId) =>
              dispatch({
                type: "setState",
                payload: { toChain: chainId },
              })
            }
          />
        }
        tokenElement={
          <TokenSelector
            selectedChainId={toChain}
            selectedToken={toToken}
            onSelectToken={(token) =>
              dispatch({
                type: "setState",
                payload: { toToken: token },
              })
            }
          />
        }
        addressElement={
          <Editable
            defaultValue={toAddress}
            placeholder="Recipient Address"
            onSubmit={handleChangeToAddress}
          >
            {({ isEditing, onEdit }) =>
              !isEditing ? (
                <Button
                  colorScheme="gray"
                  variant="outline"
                  size="sm"
                  fontWeight="regular"
                  leftIcon={<EditIcon boxSize={3} />}
                  onClick={onEdit}
                  title="Edit recipient address"
                >
                  {StringHelper.shortenAddress(toAddress || "")}
                </Button>
              ) : (
                <EditableInput
                  textAlign="right"
                  _focus={{
                    boxShadow: "none",
                  }}
                />
              )
            }
          </Editable>
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
      <Button
        colorScheme="brand"
        size="lg"
        fontWeight="bold"
        w="full"
        isDisabled={!isReadyForRoute}
      >
        Swap
      </Button>
    </Stack>
  )
}
