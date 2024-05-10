"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Highlight,
  Image,
} from "@chakra-ui/react";
import {
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalEvents,
} from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import { Avatar } from "~/app/libs/avatar";

export default function Header() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const events = useWeb3ModalEvents();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (events?.data?.event === "MODAL_LOADED") {
      setIsLoading(false);
    }
  }, [events?.data?.event]);

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

        {isConnected && address ? (
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
            {address.slice(0, 6)}...{address.slice(-4)}
          </Button>
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
        )}
      </Container>
    </Box>
  );
}
