"use client";

import { EditIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  Flex,
  IconButton,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import SwapInput from "~/app/components/SwapInput";
import ButtonReverse from "~/app/components/ButtonReverse";
import ChainSelector from "~/app/containers/ChainSelector";
import TokenSelector from "~/app/containers/TokenSelector";
import { useMainContext } from "~/app/contexts/MainContext";
import {
  useSwitchNetwork,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { StringHelper } from "~/app/libs/string";
import { HttpHelper } from "~/app/libs/http";
import { ethers } from "ethers";
import { NumberHelper } from "~/app/libs/number";
import { ExecuteRoute, RouteData } from "@0xsquid/sdk";
import { TransactionResponse } from "ethers";

export default function Swap() {
  const toast = useToast();
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
  } = useMainContext();
  const { address, isConnected, chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { switchNetwork } = useSwitchNetwork();
  const [route, setRoute] = useState<RouteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSwap, setIsLoadingSwap] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isReadyForRoute, setIsReadyForRoute] = useState(false);
  const [fromAmountInDollar, setFromAmountInDollar] = useState(0);
  const [toAmountInDollar, setToAmountInDollar] = useState(0);
  const [exchangeRate, setExchangeRate] = useState("");
  const [networkFee, setNetworkFee] = useState("");
  const [priceImpact, setPriceImpact] = useState("");

  async function getBalance() {
    if (!walletProvider || !address) return;

    // get balance of the connected wallet address
    const balance = await new ethers.BrowserProvider(walletProvider).getBalance(
      address
    );
    dispatch({ type: "setState", payload: { balance: Number(balance) } });
  }

  useEffect(() => {
    // when wallet connected, set its address to default toAddress
    if (isConnected) {
      dispatch({ type: "setState", payload: { toAddress: address } });

      getBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, dispatch, isConnected]);

  // reverse from and to chain and token
  function handleReverseFromTo() {
    dispatch({
      type: "setState",
      payload: {
        fromChain: toChain,
        toChain: fromChain,
        fromToken: toToken,
        toToken: fromToken,
      },
    });
  }

  // get route from squid when payload is ready
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
    };

    try {
      setIsReadyForRoute(false);
      setIsLoading(true);
      setErrorMessage("");
      const res = await squid?.getRoute(params);

      // set estimated toAmount
      const estimatedToAmount = res?.route?.estimate?.toAmount;
      dispatch({
        type: "setState",
        payload: { toAmount: Number(estimatedToAmount) / 1e18 },
      });

      // set ready for route
      if (res?.route?.estimate?.toAmount) {
        setIsReadyForRoute(true);
        setRoute(res?.route);
      }

      // set exchange rate
      const rate = res?.route?.estimate?.exchangeRate || "";
      setExchangeRate(Number(rate).toFixed(4));

      // set network fee
      const fee = res?.route?.estimate?.feeCosts[0]?.amountUSD || "";
      setNetworkFee(fee);

      // set price impact
      const impact = res?.route?.estimate?.aggregatePriceImpact || "";
      setPriceImpact(impact);
    } catch (err) {
      const error = HttpHelper.axiosErrorHandler(err);
      setErrorMessage(error?.errors?.[0]?.message || error?.message || "");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // get route if payload is ready
    if (fromChain && fromToken && fromAmount && toChain && toToken) {
      getRoute();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, fromChain, fromToken, toChain, toToken]);

  function handleChangeToAddress(value: string) {
    if (!value) return;
    dispatch({
      type: "setState",
      payload: { toAddress: value },
    });
  }

  // get amount token and convert it to dollar price
  async function getAmountInDollar(
    chain: string | number,
    token: string | number,
    amount: number
  ) {
    const price = await squid?.getTokenPrice({
      chainId: chain,
      tokenAddress: String(token),
    });
    return price ? Number((amount * price).toFixed(4)) : 0;
  }

  useEffect(() => {
    // get fromAmount in dollar
    if (fromAmount && fromChain && fromToken && squid) {
      getAmountInDollar(fromChain, fromToken, fromAmount).then((value) =>
        setFromAmountInDollar(value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, fromChain, fromToken, squid]);

  useEffect(() => {
    // get fromAmount in dollar
    if (toAmount && toChain && toToken && squid) {
      getAmountInDollar(toChain, toToken, toAmount).then((value) =>
        setToAmountInDollar(value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toAmount, toChain, toToken, squid]);

  // get from token symbol
  const fromTokenSymbol = useMemo(() => {
    const token = squid?.tokens.find(
      (token) => token.chainId === fromChain && token.address === fromToken
    )?.symbol;
    return token || "";
  }, [fromChain, fromToken, squid?.tokens]);

  // get to token symbol
  const toTokenSymbol = useMemo(() => {
    const token = squid?.tokens.find(
      (token) => token.chainId === toChain && token.address === toToken
    )?.symbol;
    return token || "";
  }, [squid?.tokens, toChain, toToken]);

  // get exchange rate string
  const exchangeRateString = useMemo(() => {
    if (fromTokenSymbol && exchangeRate && toTokenSymbol) {
      return `1 ${fromTokenSymbol} ≈ ${exchangeRate} ${toTokenSymbol}`;
    }
    return "";
  }, [exchangeRate, fromTokenSymbol, toTokenSymbol]);

  // handle swap transaction
  async function handleSubmitSwap() {
    if (!walletProvider || !address || !route) return;
    const signer = await new ethers.BrowserProvider(walletProvider).getSigner();

    console.debug("signer", signer);

    try {
      setIsLoadingSwap(true);
      setErrorMessage("");
      const tx = await squid?.executeRoute({
        signer: signer as unknown as ExecuteRoute["signer"],
        route,
      });

      const txReceipt = await (tx as unknown as TransactionResponse)?.wait();

      console.debug("txReceipt", txReceipt);
    } catch (err) {
      const error = HttpHelper.axiosErrorHandler(err);
      setErrorMessage(error?.errors?.[0]?.message || error?.message || error);
    } finally {
      setIsLoadingSwap(false);
    }
  }

  function handleSubmitSwapDemo() {
    setIsLoadingSwap(true);
    setTimeout(() => {
      toast({
        title: "Swap Success",
        description: `You have
        swapped ${fromAmount} ${fromTokenSymbol} to ${toAmount} ${toTokenSymbol}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsLoadingSwap(false);
    }, 3000);
  }

  return (
    <Stack spacing="5" w="full" bg="white" maxW="lg" rounded="2xl" p="8">
      {/* Header */}
      <Flex justify="space-between">
        <Flex gap="4">
          <Button color="gray.600" fontWeight="medium" variant="link">
            Swap
          </Button>
          <Button color="gray.300" fontWeight="medium" variant="link">
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
        label={`You pay $${fromAmountInDollar}`}
        value={fromAmount}
        balanceElement={
          <Text
            fontSize="xs"
            cursor="pointer"
            onClick={() =>
              dispatch({
                type: "setState",
                payload: { fromAmount: Number(balance) / 1e18 },
              })
            }
          >
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
                payload: { fromChain: chainId, fromToken: "" },
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

      {/* Reverse source and destination chain and token */}
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
                payload: { toChain: chainId, toToken: "" },
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
              {exchangeRateString || "-"}
            </Text>
          </Skeleton>
        </Flex>
        <Flex justify="space-between">
          <Text>Network Fee</Text>
          <Skeleton isLoaded={!isLoading}>
            <Text color="gray.600">{networkFee ? `$${networkFee}` : "-"}</Text>
          </Skeleton>
        </Flex>
        <Flex justify="space-between">
          <Text>Price Impact</Text>
          <Skeleton isLoaded={!isLoading}>
            <Text color="gray.600">
              {priceImpact ? `${priceImpact}%` : "-"}
            </Text>
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
        isLoading={isLoading || isLoadingSwap}
        loadingText={isLoading ? "Getting Route..." : "Swapping..."}
        onClick={handleSubmitSwapDemo}
      >
        Swap
      </Button>
    </Stack>
  );
}
