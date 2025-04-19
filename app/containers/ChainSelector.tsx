"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputLeftElement,
  Input,
  Image,
  useDisclosure,
  Box,
  Stack,
} from "@chakra-ui/react";
import { useMainContext } from "~/app/contexts/MainContext";

interface Props {
  defaultChainId?: string | number;
  selectedChainId?: string | number;
  onSelectChain: (chainId: string | number) => void;
}

export default function ChainSelector({
  defaultChainId,
  selectedChainId,
  onSelectChain,
}: Props) {
  const {
    state: { squid },
  } = useMainContext();
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * Clear search input and reset search state
   */
  function handleClear() {
    setSearch("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  /**
   * Get selected chain from squid chains list by selectedChainId
   */
  const selectedChain = useMemo(
    () =>
      squid?.chains?.find(
        (chain) => chain.chainId === (selectedChainId || defaultChainId)
      ),
    [defaultChainId, selectedChainId, squid?.chains]
  );

  /**
   * Handle select chain event and set selected chain id
   * @param chainId
   */
  function handleSelect(chainId: string | number) {
    onSelectChain(chainId);
    onClose();
    handleClear();
  }

  return (
    <>
      <Button
        colorScheme="gray"
        variant="outline"
        size="sm"
        fontWeight="medium"
        rightIcon={<ChevronDownIcon />}
        leftIcon={
          selectedChain ? (
            <Image
              h="20px"
              w="20px"
              alt={`img-${selectedChain?.axelarChainName}`}
              src={selectedChain?.chainIconURI}
            />
          ) : (
            <></>
          )
        }
        onClick={onOpen}
      >
        {selectedChain?.axelarChainName || "Select Chain"}
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
          w="250px"
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
                placeholder="Search network"
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
              {squid?.chains
                // filter chains by search input
                ?.filter((chain) =>
                  chain?.axelarChainName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
                )
                // limit to show max 15 items
                .slice(0, 15)
                .map((chain) => (
                  <Button
                    key={chain?.chainId}
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
                        h="24px"
                        w="24px"
                        alt={`img-${chain?.axelarChainName}`}
                        src={chain?.chainIconURI}
                      />
                    }
                    onClick={() => handleSelect(chain?.chainId)}
                  >
                    {chain?.axelarChainName}
                  </Button>
                ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
