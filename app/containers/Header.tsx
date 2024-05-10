"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Highlight,
  Text,
} from "@chakra-ui/react";

export default function Header() {
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
        <Button colorScheme="brand">Connect</Button>
      </Container>
    </Box>
  );
}
