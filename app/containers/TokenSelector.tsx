"use client"

import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import { useMemo, useState } from "react"
import { useMainContext } from "~/app/contexts/MainContext"

interface Props {
  selectedChainId?: string | number
  selectedToken?: string | number
  onSelectToken: (token: string) => void
}

export default function TokenSelector({
  selectedChainId,
  selectedToken,
  onSelectToken,
}: Props) {
  const {
    state: { squid },
  } = useMainContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("")

  function handleSelect(token: string) {
    onSelectToken(token)
    onClose()
  }

  const tokensOnChain = useMemo(
    () => squid?.tokens?.filter((token) => token.chainId === selectedChainId),
    [selectedChainId, squid?.tokens]
  )

  const filteredTokens = useMemo(() => {
    // Check if search input is an address then filter it by address
    if (search.startsWith("0x")) {
      return tokensOnChain?.filter((token) => token.address.includes(search))
    }

    // Filter token by symbol
    return tokensOnChain?.filter((token) =>
      token.symbol.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, tokensOnChain])

  const selectedTokenObject = useMemo(
    () => tokensOnChain?.find((token) => token.address === selectedToken),
    [selectedToken, tokensOnChain]
  )

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        fontWeight="medium"
        px="8"
        isDisabled={!selectedChainId}
        leftIcon={
          selectedTokenObject ? (
            <Image
              h="30px"
              w="30px"
              alt={`img-${selectedTokenObject?.name}`}
              src={selectedTokenObject?.logoURI}
            />
          ) : (
            <></>
          )
        }
        rightIcon={<ChevronDownIcon />}
        onClick={onOpen}
      >
        {selectedTokenObject?.symbol || "..."}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size={["full", "md"]}
        isCentered
      >
        <ModalOverlay
          bg="blackAlpha.100"
          backdropFilter="auto"
          backdropBlur="2px"
        />
        <ModalContent rounded="2xl">
          <ModalHeader color="gray.700">
            Select a token
            <Text fontSize="sm" fontWeight="400" color="gray.500">
              Select a token from our default list or search for a token by
              symbol or address.
            </Text>
          </ModalHeader>

          <ModalCloseButton variant="ghost" rounded="full" />
          <ModalBody pb="5">
            <VStack>
              {/* Search box */}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Search2Icon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search by token name or address"
                  rounded="lg"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </InputGroup>

              {/* Token list */}
              {filteredTokens
                // limit to show max 20 items
                ?.slice(0, 20)
                ?.map((token) => (
                  <Button
                    key={token?.address}
                    color="gray.700"
                    fontWeight="regular"
                    variant="ghost"
                    w="full"
                    justifyContent="flex-start"
                    rounded="lg"
                    px="2"
                    size="lg"
                    _hover={{
                      bg: "brand.100",
                    }}
                    leftIcon={
                      <Image
                        h="30px"
                        w="30px"
                        alt={`img-${token?.name}`}
                        src={token?.logoURI}
                        mr="1"
                      />
                    }
                    onClick={() => handleSelect(token?.address)}
                  >
                    <Box textAlign="left" py="2">
                      <Text fontWeight="medium" fontSize="md">
                        {token?.symbol}
                      </Text>
                      <Text fontSize="sm">{token?.name}</Text>
                    </Box>
                  </Button>
                ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
