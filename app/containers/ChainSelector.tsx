"use client"

import { useMemo, useRef, useState } from "react"
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons"
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  InputGroup,
  InputLeftElement,
  Input,
  Image,
} from "@chakra-ui/react"
import { useMainContext } from "~/app/contexts/MainContext"

interface Props {
  defaultChainId?: string | number
  selectedChainId?: string | number
  onSelectChain: (chainId: string | number) => void
}

export default function ChainSelector({
  defaultChainId,
  selectedChainId,
  onSelectChain,
}: Props) {
  const {
    state: { squid },
  } = useMainContext()
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Clear search input and reset search state
   */
  function handleClear() {
    setSearch("")

    if (inputRef.current) {
      inputRef.current.value = ""
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
  )

  return (
    <Popover initialFocusRef={inputRef} onClose={handleClear}>
      {({ onClose }) => {
        /**
         * Handle select chain event and set selected chain id
         * @param chainId
         */
        function handleSelect(chainId: string | number) {
          onSelectChain(chainId)
          onClose()
          handleClear()
        }
        return (
          <>
            <PopoverTrigger>
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
                      alt={`img-${selectedChain?.chainName}`}
                      src={selectedChain?.chainIconURI}
                    />
                  ) : (
                    <></>
                  )
                }
              >
                {selectedChain?.chainName || "Select Chain"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              bg="rgba(255, 255, 255, 0.5)"
              backdropFilter="auto"
              backdropBlur="md"
              rounded="2xl"
              maxW="250"
            >
              <PopoverHeader>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Search2Icon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search network"
                    rounded="lg"
                    ref={inputRef}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </InputGroup>
              </PopoverHeader>
              <PopoverBody px="2">
                {squid?.chains
                  // filter chains by search input
                  ?.filter((chain) =>
                    chain?.chainName
                      ?.toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  // limit to show max 15 items
                  .slice(0, 15)
                  .map((chain) => (
                    <Button
                      key={chain?.chainId}
                      color="gray.700"
                      fontWeight="regular"
                      variant="ghost"
                      w="full"
                      justifyContent="flex-start"
                      rounded="lg"
                      px="2"
                      _hover={{
                        bg: "brand.100",
                      }}
                      leftIcon={
                        <Image
                          h="24px"
                          w="24px"
                          alt={`img-${chain?.chainName}`}
                          src={chain?.chainIconURI}
                        />
                      }
                      onClick={() => handleSelect(chain?.chainId)}
                    >
                      {chain?.chainName}
                    </Button>
                  ))}
              </PopoverBody>
            </PopoverContent>
          </>
        )
      }}
    </Popover>
  )
}
