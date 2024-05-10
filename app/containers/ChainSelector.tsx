"use client"

import { useRef, useState } from "react"
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
} from "@chakra-ui/react"

interface Props {
  defaultChain?: string
}

export default function ChainSelector({ defaultChain = "Ethereum" }: Props) {
  const [selectedChain, setSelectedChain] = useState(defaultChain)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function handleClear() {
    setSearch("")

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <Popover initialFocusRef={inputRef} onClose={handleClear}>
      {({ onClose }) => {
        function handleSelect(chain: string) {
          setSelectedChain(chain)
          onClose()
          handleClear()
        }
        return (
          <>
            <PopoverTrigger>
              <Button
                colorScheme="brand"
                variant="outline"
                size="sm"
                fontWeight="medium"
                rightIcon={<ChevronDownIcon />}
              >
                {selectedChain}
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
                {MOCK_ITEMS.map(
                  (chain) =>
                    chain.toLowerCase().includes(search.toLowerCase()) && (
                      <Button
                        key={chain}
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
                        onClick={() => handleSelect(chain)}
                      >
                        {chain}
                      </Button>
                    )
                )}
              </PopoverBody>
            </PopoverContent>
          </>
        )
      }}
    </Popover>
  )
}

const MOCK_ITEMS = [
  "Ethereum",
  "Binance Smart Chain",
  "Polygon",
  "Avalanche",
  "Fantom",
  "Harmony",
  "xDai",
  "Arbitrum",
  "Optimism",
  "Celo",
  "Moonbeam",
  "Near",
  "Ronin",
  "Solana",
]
