"use client"

import {
  Box,
  Button,
  Container,
  Heading,
  Highlight,
  Image,
} from "@chakra-ui/react"
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalEvents,
} from "@web3modal/ethers/react"
import { useCallback, useEffect, useState } from "react"
import useMounted from "~/app/hooks/useMounted"
import { Avatar } from "~/app/libs/avatar"
import { StringHelper } from "~/app/libs/string"

export default function Header() {
  const { open } = useWeb3Modal()
  const { address } = useWeb3ModalAccount()
  const events = useWeb3ModalEvents()
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useMounted()

  useEffect(() => {
    if (events?.data?.event === "MODAL_LOADED") {
      setIsLoading(false)
    }
  }, [events?.data?.event])

  const renderConnectButton = useCallback(() => {
    if (!isMounted)
      return (
        <Button
          colorScheme="brand"
          fontWeight="bold"
          isLoading={isLoading}
          loadingText="Loading..."
        >
          Connect
        </Button>
      )

    if (address) {
      return (
        <Button
          colorScheme="brand"
          fontWeight="bold"
          onClick={() => open({ view: "Account" })}
          leftIcon={
            <Image
              height="6"
              width="6"
              src={Avatar.generate(address)}
              alt="profile-img"
            />
          }
        >
          {StringHelper.shortenAddress(address)}
        </Button>
      )
    }

    return (
      <Button
        colorScheme="brand"
        fontWeight="bold"
        isLoading={isLoading}
        loadingText="Loading..."
        onClick={() => open()}
      >
        Connect
      </Button>
    )
  }, [address, isLoading, isMounted, open])

  return (
    <Box>
      <Container
        maxW="container.lg"
        p="5"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading as="h1" size="lg" color="brand.500" fontWeight="bold">
          <Highlight query="App" styles={{ color: "gray.800" }}>
            SwapyApp
          </Highlight>
        </Heading>
        {renderConnectButton()}

        {/* <Button
          colorScheme="brand"
          fontWeight="bold"
          onClick={() => open({ view: "Account" })}
          leftIcon={
            <Image
              height="6"
              width="6"
              src={Avatar.generate("asw")}
              alt="profile-img"
            />
          }
        >
          {StringHelper.shortenAddress("asw")}
        </Button> */}
        {/* {isConnected && address ? (
        ) : (
          <Button
            colorScheme="brand"
            fontWeight="bold"
            isLoading={isLoading}
            loadingText="Loading..."
            onClick={() => open()}
          >
            Connect
          </Button>
        )} */}
      </Container>
    </Box>
  )
}
