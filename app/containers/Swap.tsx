"use client";

import { EditIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Editable,
  EditableInput,
  Flex,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
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
import { ExecuteRoute } from "@0xsquid/sdk/dist/types";
import { TransactionResponse } from "ethers";
import { motion } from "framer-motion";
import { FiInfo, FiSettings, FiSliders, FiChevronRight } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionButton = motion(Button);

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
  const [route, setRoute] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSwap, setIsLoadingSwap] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isReadyForRoute, setIsReadyForRoute] = useState(false);
  const [fromAmountInDollar, setFromAmountInDollar] = useState(0);
  const [toAmountInDollar, setToAmountInDollar] = useState(0);
  const [exchangeRate, setExchangeRate] = useState("");
  const [networkFee, setNetworkFee] = useState("");
  const [priceImpact, setPriceImpact] = useState("");
  const [activeTab, setActiveTab] = useState("swap");
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const [slippageOption, setSlippageOption] = useState("auto");
  const [customSlippage, setCustomSlippage] = useState("1.0");
  const [transactionDeadline, setTransactionDeadline] = useState(20);
  const [routingPreference, setRoutingPreference] = useState("bestPrice");

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
      fromChain: String(fromChain),
      fromToken: String(fromToken),
      fromAmount: String(fromAmount * 1e18),
      toChain: String(toChain),
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
      const fee = res?.route?.estimate?.feeCosts[0]?.amountUsd || "";
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
      chainId: String(chain),
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
        swapped ${fromAmount.toFixed(
          4
        )} ${fromTokenSymbol} to ${toAmount.toFixed(4)} ${toTokenSymbol}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoadingSwap(false);
    }, 1000);
  }

  // Handle saving settings
  function handleSaveSettings() {
    const slippageValue =
      slippageOption === "custom" ? parseFloat(customSlippage) : 1.0; // Default auto slippage is 1.0%

    dispatch({
      type: "setState",
      payload: {
        slippage: slippageValue,
        // Additional settings can be saved to the context too if needed
      },
    });

    toast({
      title: "Settings Updated",
      description: `Slippage tolerance set to ${slippageValue}%`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });

    onSettingsClose();
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      w="full"
      maxW="lg"
      overflow="hidden"
    >
      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={onSettingsClose}
        isCentered
        size="sm"
      >
        <ModalOverlay bg="rgba(0, 0, 0, 0.1)" backdropFilter="blur(4px)" />
        <ModalContent
          bg="rgba(255, 255, 255, 0.8)"
          backdropFilter="blur(10px)"
          rounded="2xl"
          borderColor="rgba(255, 255, 255, 0.5)"
          borderWidth="1px"
          boxShadow="0 8px 32px rgba(139, 92, 246, 0.15)"
          overflow="hidden"
        >
          <ModalHeader
            p="4"
            borderBottomWidth="1px"
            borderColor="rgba(255, 255, 255, 0.2)"
            fontWeight="600"
            color="gray.700"
          >
            Advanced Settings
          </ModalHeader>
          <ModalBody p="5">
            <Stack spacing="6">
              {/* Slippage Tolerance */}
              <Box>
                <Flex justify="space-between" align="center" mb="3">
                  <Flex align="center" gap="1.5">
                    <Text fontWeight="medium" color="gray.700">
                      Slippage Tolerance
                    </Text>
                    <Tooltip
                      label="Your transaction will revert if the price changes unfavorably by more than this percentage"
                      placement="top"
                      bg="gray.700"
                      color="white"
                      borderRadius="md"
                      hasArrow
                    >
                      <Box cursor="help" color="gray.400">
                        <Icon as={FiInfo} boxSize={3.5} />
                      </Box>
                    </Tooltip>
                  </Flex>
                  <Text color="brand.500" fontWeight="semibold">
                    {slippageOption === "auto" ? "1.0%" : `${customSlippage}%`}
                  </Text>
                </Flex>

                <RadioGroup
                  onChange={setSlippageOption}
                  value={slippageOption}
                  mb="4"
                >
                  <Stack direction="row" spacing="4">
                    <Radio
                      value="auto"
                      colorScheme="purple"
                      borderColor="brand.200"
                    >
                      Auto (1.0%)
                    </Radio>
                    <Radio
                      value="custom"
                      colorScheme="purple"
                      borderColor="brand.200"
                    >
                      Custom
                    </Radio>
                  </Stack>
                </RadioGroup>

                {slippageOption === "custom" && (
                  <NumberInput
                    value={customSlippage}
                    onChange={(value) => setCustomSlippage(value)}
                    min={0.1}
                    max={50}
                    step={0.1}
                    precision={1}
                    size="md"
                  >
                    <NumberInputField
                      borderColor="brand.100"
                      _focus={{
                        borderColor: "brand.300",
                        boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.3)",
                      }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper
                        borderColor="brand.100"
                        color="brand.500"
                      />
                      <NumberDecrementStepper
                        borderColor="brand.100"
                        color="brand.500"
                      />
                    </NumberInputStepper>
                  </NumberInput>
                )}

                {parseFloat(customSlippage) > 5 &&
                  slippageOption === "custom" && (
                    <Text color="orange.500" fontSize="sm" mt="2">
                      <Icon as={FiInfo} mr="1" />
                      High slippage values can lead to bad rates
                    </Text>
                  )}
              </Box>

              {/* Transaction Deadline */}
              <Box>
                <Flex justify="space-between" align="center" mb="3">
                  <Flex align="center" gap="1.5">
                    <Text fontWeight="medium" color="gray.700">
                      Transaction Deadline
                    </Text>
                    <Tooltip
                      label="Your transaction will revert if it is pending for more than this period of time"
                      placement="top"
                      bg="gray.700"
                      color="white"
                      borderRadius="md"
                      hasArrow
                    >
                      <Box cursor="help" color="gray.400">
                        <Icon as={FiInfo} boxSize={3.5} />
                      </Box>
                    </Tooltip>
                  </Flex>
                </Flex>

                <Flex align="center" gap="2">
                  <NumberInput
                    value={transactionDeadline}
                    onChange={(value) => setTransactionDeadline(Number(value))}
                    min={1}
                    max={60}
                    size="md"
                    w="100px"
                  >
                    <NumberInputField
                      borderColor="brand.100"
                      _focus={{
                        borderColor: "brand.300",
                        boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.3)",
                      }}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper
                        borderColor="brand.100"
                        color="brand.500"
                      />
                      <NumberDecrementStepper
                        borderColor="brand.100"
                        color="brand.500"
                      />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text color="gray.500">minutes</Text>
                </Flex>
              </Box>

              {/* Routing Preference */}
              <Box>
                <Flex justify="space-between" align="center" mb="3">
                  <Flex align="center" gap="1.5">
                    <Text fontWeight="medium" color="gray.700">
                      Routing Preference
                    </Text>
                    <Tooltip
                      label="Choose how you want your transactions to be routed"
                      placement="top"
                      bg="gray.700"
                      color="white"
                      borderRadius="md"
                      hasArrow
                    >
                      <Box cursor="help" color="gray.400">
                        <Icon as={FiInfo} boxSize={3.5} />
                      </Box>
                    </Tooltip>
                  </Flex>
                </Flex>

                <RadioGroup
                  value={routingPreference}
                  onChange={setRoutingPreference}
                  mb="2"
                >
                  <Stack direction="column" spacing="3">
                    <Radio
                      value="bestPrice"
                      colorScheme="purple"
                      borderColor="brand.200"
                    >
                      <Flex align="center" gap="2">
                        <Text fontWeight="medium">Best Price</Text>
                        <Tag
                          size="sm"
                          bg="green.50"
                          color="green.600"
                          borderRadius="full"
                        >
                          Recommended
                        </Tag>
                      </Flex>
                    </Radio>
                    <Radio
                      value="lowestGas"
                      colorScheme="purple"
                      borderColor="brand.200"
                    >
                      <Text fontWeight="medium">Lowest Gas</Text>
                    </Radio>
                    <Radio
                      value="fastest"
                      colorScheme="purple"
                      borderColor="brand.200"
                    >
                      <Text fontWeight="medium">Fastest Transaction</Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>

              <Divider borderColor="gray.200" />

              <Button
                colorScheme="brand"
                onClick={handleSaveSettings}
                w="full"
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition="0.2s ease-in-out"
              >
                Save Settings
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(10px)"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="rgba(255, 255, 255, 0.5)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
        p="6"
        position="relative"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "0 10px 40px rgba(87, 134, 251, 0.12)",
        }}
      >
        {/* Background decorative elements */}
        <Box
          position="absolute"
          top="-100px"
          right="-100px"
          width="200px"
          height="200px"
          bg="brand.50"
          borderRadius="full"
          opacity="0.5"
          zIndex="0"
        />
        <Box
          position="absolute"
          bottom="-80px"
          left="-80px"
          width="150px"
          height="150px"
          bg="brand.100"
          borderRadius="full"
          opacity="0.3"
          zIndex="0"
        />

        {/* Header */}
        <Flex justify="space-between" mb="6">
          <HStack spacing="6">
            <Button
              color={activeTab === "swap" ? "brand.500" : "gray.400"}
              fontWeight="semibold"
              fontSize="lg"
              variant="link"
              onClick={() => setActiveTab("swap")}
              position="relative"
              _after={{
                content: '""',
                display: activeTab === "swap" ? "block" : "none",
                position: "absolute",
                bottom: "-2px",
                left: "0",
                width: "100%",
                height: "2px",
                bg: "brand.500",
                borderRadius: "full",
              }}
            >
              Swap
            </Button>
            <Button
              color={activeTab === "buy" ? "brand.500" : "gray.400"}
              fontWeight="semibold"
              fontSize="lg"
              variant="link"
              onClick={() => setActiveTab("buy")}
              position="relative"
              _after={{
                content: '""',
                display: activeTab === "buy" ? "block" : "none",
                position: "absolute",
                bottom: "-2px",
                left: "0",
                width: "100%",
                height: "2px",
                bg: "brand.500",
                borderRadius: "full",
              }}
            >
              Buy
            </Button>
          </HStack>
          <HStack spacing="3">
            <Tag
              size="sm"
              bg="brand.50"
              color="brand.500"
              borderRadius="full"
              fontWeight="medium"
              px="2"
            >
              {slippage}% Slip
            </Tag>
            <Tooltip
              label="Advanced settings"
              placement="top"
              bg="gray.700"
              color="white"
              borderRadius="md"
              hasArrow
            >
              <IconButton
                aria-label="btn-setting"
                bg="transparent"
                icon={<Icon as={FiSettings} color="gray.500" boxSize={5} />}
                _hover={{ bg: "rgba(255, 255, 255, 0.3)", color: "brand.500" }}
                as={motion.button}
                whileHover={{ rotate: 90 }}
                transition="0.3s ease-in-out"
                onClick={onSettingsOpen}
              />
            </Tooltip>
          </HStack>
        </Flex>

        {/* Swap tag */}
        <MotionBox
          position="absolute"
          top="2"
          right="6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Tag
            size="sm"
            bg="brand.50"
            color="brand.500"
            borderRadius="full"
            fontWeight="medium"
            px="3"
          >
            AI Powered
          </Tag>
        </MotionBox>

        {/* Swap Entities */}
        <Box
          position="relative"
          zIndex="1"
          display="flex"
          flexDirection="column"
          gap="6"
        >
          <SwapInput
            name="from"
            zIndex={1000}
            label={`You pay $${fromAmountInDollar}`}
            value={fromAmount}
            balanceElement={
              <Text
                fontSize="xs"
                cursor="pointer"
                color="brand.500"
                fontWeight="medium"
                _hover={{ textDecoration: "underline" }}
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
              dispatch({
                type: "setState",
                payload: { fromAmount: Number(value) },
              })
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
                      variant="glass"
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
        </Box>

        <Divider my="5" borderColor="gray.200" />

        {/* Swap Information */}
        <Stack spacing="3" mb="5" fontSize="sm" color="gray.500">
          <Flex justify="space-between">
            <Flex align="center" gap="1.5">
              <Text>Exchange Rate</Text>
              <Tooltip
                label="The exchange rate between tokens"
                placement="top"
                bg="gray.700"
                color="white"
                borderRadius="md"
                hasArrow
              >
                <Box cursor="help" color="gray.400">
                  <Icon as={FiInfo} boxSize={3.5} />
                </Box>
              </Tooltip>
            </Flex>
            <Skeleton
              isLoaded={!isLoading}
              startColor="brand.100"
              endColor="brand.50"
            >
              <Text color="brand.500" fontWeight="medium">
                {exchangeRateString || "-"}
              </Text>
            </Skeleton>
          </Flex>
          <Flex justify="space-between">
            <Flex align="center" gap="1.5">
              <Text>Network Fee</Text>
              <Tooltip
                label="Fee charged by the network for processing the transaction"
                placement="top"
                bg="gray.700"
                color="white"
                borderRadius="md"
                hasArrow
              >
                <Box cursor="help" color="gray.400">
                  <Icon as={FiInfo} boxSize={3.5} />
                </Box>
              </Tooltip>
            </Flex>
            <Skeleton
              isLoaded={!isLoading}
              startColor="brand.100"
              endColor="brand.50"
            >
              <Text color="gray.600" fontWeight="medium">
                {networkFee ? `$${networkFee}` : "-"}
              </Text>
            </Skeleton>
          </Flex>
          <Flex justify="space-between">
            <Flex align="center" gap="1.5">
              <Text>Price Impact</Text>
              <Tooltip
                label="The difference between market price and estimated price due to trade size"
                placement="top"
                bg="gray.700"
                color="white"
                borderRadius="md"
                hasArrow
              >
                <Box cursor="help" color="gray.400">
                  <Icon as={FiInfo} boxSize={3.5} />
                </Box>
              </Tooltip>
            </Flex>
            <Skeleton
              isLoaded={!isLoading}
              startColor="brand.100"
              endColor="brand.50"
            >
              <Text
                color={
                  priceImpact && Number(priceImpact) > 3
                    ? "brand.error"
                    : "gray.600"
                }
                fontWeight="medium"
              >
                {priceImpact ? `${priceImpact}%` : "-"}
              </Text>
            </Skeleton>
          </Flex>
        </Stack>

        {/* Error Message */}
        {errorMessage && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            mb="5"
            p="4"
            bg="red.50"
            rounded="xl"
            border="1px"
            borderColor="red.200"
            color="red.500"
          >
            {errorMessage}
          </MotionBox>
        )}

        {/* Swap Button */}
        <MotionButton
          colorScheme="brand"
          size="lg"
          fontWeight="bold"
          w="full"
          h="14"
          isDisabled={!isReadyForRoute}
          isLoading={isLoading || isLoadingSwap}
          loadingText={isLoading ? "Getting Route..." : "Swapping..."}
          onClick={handleSubmitSwapDemo}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 5px 20px rgba(139, 92, 246, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
          transition="0.3s ease-in-out"
          bgGradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
          leftIcon={<Icon as={FiSliders} />}
        >
          Swap Now
        </MotionButton>
      </Box>
    </MotionBox>
  );
}
