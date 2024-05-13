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
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react"
import { use, useEffect, useMemo, useState } from "react"
import SwapInput from "~/app/components/SwapInput"
import ButtonReverse from "~/app/components/ButtonReverse"
import ChainSelector from "~/app/containers/ChainSelector"
import TokenSelector from "~/app/containers/TokenSelector"
import { useMainContext } from "~/app/contexts/MainContext"
import {
  useWalletInfo,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react"
import { StringHelper } from "~/app/libs/string"
import { HttpHelper } from "~/app/libs/http"
import { ethers } from "ethers"
import { NumberHelper } from "~/app/libs/number"

export default function Swap() {
  const {
    state: {
      squid,
      balance,
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      toAddress,
      slippage,
    },
    dispatch,
  } = useMainContext()
  const { address, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"swap" | "buy">("swap")
  const [errorMessage, setErrorMessage] = useState("")
  const [isReadyForRoute, setIsReadyForRoute] = useState(false)
  const [fromAmountInDollar, setFromAmountInDollar] = useState(0)
  const [toAmountInDollar, setToAmountInDollar] = useState(0)
  const [exchangeRate, setExchangeRate] = useState("")
  const [networkFee, setNetworkFee] = useState("")
  const [priceImpact, setPriceImpact] = useState("")

  async function getBalance() {
    if (!walletProvider || !address) return

    // get balance of the connected wallet address
    const balance = await new ethers.BrowserProvider(walletProvider).getBalance(
      address
    )
    dispatch({ type: "setState", payload: { balance: Number(balance) } })
  }

  useEffect(() => {
    // when wallet connected, set its address to default toAddress
    if (isConnected) {
      dispatch({ type: "setState", payload: { toAddress: address } })

      getBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function getRoute() {
    const params = {
      fromChain,
      fromToken: String(fromToken),
      fromAmount: String(fromAmount * 1e18),
      toChain,
      toToken: String(toToken),
      fromAddress: String(address),
      toAddress,
      slippage,
    }

    try {
      setIsLoading(true)
      setErrorMessage("")
      const res = await squid?.getRoute(params)

      // set estimated toAmount
      const estimatedToAmount = res?.route?.estimate?.toAmount
      dispatch({
        type: "setState",
        payload: { toAmount: Number(estimatedToAmount) / 1e18 },
      })

      // set exchange rate
      const rate = res?.route?.estimate?.exchangeRate || ""
      setExchangeRate(Number(rate).toFixed(4))

      // set network fee
      const fee = res?.route?.estimate?.feeCosts[0]?.amountUSD || ""
      setNetworkFee(fee)

      // set price impact
      const impact = res?.route?.estimate?.aggregatePriceImpact || ""
      setPriceImpact(impact)
    } catch (err) {
      const error = HttpHelper.axiosErrorHandler(err)
      setErrorMessage(error?.errors?.[0]?.message || error?.message || "")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // get route if payload is ready
    if (fromChain && fromToken && fromAmount && toChain && toToken) {
      setIsReadyForRoute(true)
      getRoute()
      return
    }
    setIsReadyForRoute(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, fromChain, fromToken, toChain, toToken])

  function handleChangeToAddress(value: string) {
    if (!value) return
    dispatch({
      type: "setState",
      payload: { toAddress: value },
    })
  }

  function setBalanceToAmount() {
    dispatch({
      type: "setState",
      payload: { fromAmount: Number(balance) / 1e18 },
    })
  }

  async function getAmountInDollar(
    chain: string | number,
    token: string | number,
    amount: number
  ) {
    const price = await squid?.getTokenPrice({
      chainId: chain,
      tokenAddress: String(token),
    })
    return price ? Number((amount * price).toFixed(4)) : 0
  }

  useEffect(() => {
    // get fromAmount in dollar
    if (fromAmount && fromChain && fromToken && squid) {
      getAmountInDollar(fromChain, fromToken, fromAmount).then((value) =>
        setFromAmountInDollar(value)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, fromChain, fromToken, squid])

  useEffect(() => {
    // get fromAmount in dollar
    if (toAmount && toChain && toToken && squid) {
      getAmountInDollar(toChain, toToken, toAmount).then((value) =>
        setToAmountInDollar(value)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toAmount, toChain, toToken, squid])

  // get from token symbol
  const fromTokenSymbol = useMemo(() => {
    const token = squid?.tokens.find(
      (token) => token.address === fromToken
    )?.symbol
    return token || ""
  }, [fromToken, squid?.tokens])

  // get to token symbol
  const toTokenSymbol = useMemo(() => {
    const token = squid?.tokens.find(
      (token) => token.address === toToken
    )?.symbol
    return token || ""
  }, [toToken, squid?.tokens])

  const exchangeRateString = useMemo(() => {
    if (fromTokenSymbol && exchangeRate && toTokenSymbol) {
      return `1 ${fromTokenSymbol} ≈ ${exchangeRate} ${toTokenSymbol}`
    }
    return ""
  }, [exchangeRate, fromTokenSymbol, toTokenSymbol])

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
        isLoading={isLoading}
        label={`You pay $${fromAmountInDollar}`}
        value={fromAmount}
        balanceElement={
          <Text fontSize="xs" cursor="pointer" onClick={setBalanceToAmount}>
            Balance: {NumberHelper.formatBalance(balance)} ETH
          </Text>
        }
        onChange={(value) =>
          dispatch({ type: "setState", payload: { fromAmount: Number(value) } })
        }
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
        label={`You get $${toAmountInDollar}`}
        isLoading={isLoading}
        isReadOnly
        value={toAmount}
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
          <Skeleton isLoaded={!isLoading}>
            <Text color="brand.500" fontWeight="medium">
              {exchangeRateString}
            </Text>
          </Skeleton>
        </Flex>
        <Flex justify="space-between">
          <Text>Network Fee</Text>
          <Skeleton isLoaded={!isLoading}>
            <Text color="gray.600">${networkFee}</Text>
          </Skeleton>
        </Flex>
        <Flex justify="space-between">
          <Text>Price Impact</Text>
          <Skeleton isLoaded={!isLoading}>
            <Text color="gray.600">{priceImpact}%</Text>
          </Skeleton>
        </Flex>
      </Stack>

      {/* Error Message */}
      {errorMessage && (
        <Box
          mt="-3"
          p="3"
          bg="red.50"
          rounded="lg"
          border="1px"
          borderColor="red.200"
          color="red.500"
        >
          {errorMessage}
        </Box>
      )}

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
