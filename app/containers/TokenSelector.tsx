"use client";

import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
import { useMainContext } from "~/app/contexts/MainContext";

interface Props {
  selectedChainId?: string | number;
  selectedToken?: string | number;
  onSelectToken: (token: string) => void;
}

export default function TokenSelector({
  selectedChainId,
  selectedToken,
  onSelectToken,
}: Props) {
  const {
    state: { squid },
  } = useMainContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(token: string) {
    onSelectToken(token);
    onClose();
    setSearch("");
  }

  const tokensOnChain = useMemo(
    () => squid?.tokens?.filter((token) => token.chainId === selectedChainId),
    [selectedChainId, squid?.tokens]
  );

  const filteredTokens = useMemo(() => {
    // Check if search input is an address then filter it by address
    if (search.startsWith("0x")) {
      return tokensOnChain?.filter((token) => token.address.includes(search));
    }

    // Filter token by symbol
    return tokensOnChain?.filter((token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tokensOnChain]);

  const selectedTokenObject = useMemo(
    () => tokensOnChain?.find((token) => token.address === selectedToken),
    [selectedToken, tokensOnChain]
  );

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        fontWeight="medium"
        px="6"
        isDisabled={!selectedChainId}
        leftIcon={
          selectedTokenObject ? (
            <Image
              h="28px"
              w="28px"
              alt={`img-${selectedTokenObject?.name}`}
              src={selectedTokenObject?.logoURI}
            />
          ) : (
            <></>
          )
        }
        rightIcon={<ChevronDownIcon />}
        onClick={onOpen}
        _hover={{
          bg: "rgba(255, 255, 255, 0.8)",
        }}
      >
        {selectedTokenObject?.symbol || "Select Token"}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={inputRef}
        size="xs"
        isCentered
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
          maxH="400px"
          w="280px"
          mx="auto"
        >
          <ModalHeader
            p="3"
            borderBottomWidth="1px"
            borderColor="rgba(255, 255, 255, 0.2)"
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Search2Icon color="brand.500" />
              </InputLeftElement>
              <Input
                placeholder="Search token name"
                rounded="lg"
                ref={inputRef}
                onChange={(event) => setSearch(event.target.value)}
                borderColor="brand.100"
                _focus={{
                  borderColor: "brand.300",
                  boxShadow: "0 0 0 1px rgba(139, 92, 246, 0.3)",
                }}
              />
            </InputGroup>
          </ModalHeader>
          <ModalBody p="2" maxH="300px" overflowY="auto">
            <Stack spacing="1">
              {filteredTokens
                // limit to show max 20 items
                ?.slice(0, 20)
                ?.map((token) => (
                  <Button
                    key={token?.address}
                    color="gray.700"
                    fontWeight="medium"
                    variant="ghost"
                    w="full"
                    justifyContent="flex-start"
                    rounded="lg"
                    px="3"
                    py="2"
                    _hover={{
                      bg: "brand.50",
                      color: "brand.600",
                    }}
                    leftIcon={
                      <Image
                        h="28px"
                        w="28px"
                        alt={`img-${token?.name}`}
                        src={token?.logoURI}
                        mr="1"
                      />
                    }
                    onClick={() => handleSelect(token?.address)}
                  >
                    <Box textAlign="left">
                      <Text fontWeight="semibold" fontSize="sm">
                        {token?.symbol}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {token?.name}
                      </Text>
                    </Box>
                  </Button>
                ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
