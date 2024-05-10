"use client";

import { SettingsIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { useState } from "react";

export default function Swap() {
  const [mode, setMode] = useState<"swap" | "buy">("swap");
  return (
    <Box w="full" bg="white" maxW="lg" rounded="2xl" p="8">
      <Flex justify="space-between">
        <Flex gap="4">
          <Button
            color={mode === "swap" ? "gray.600" : "gray.300"}
            fontWeight="medium"
            variant="link"
            onClick={() => setMode("swap")}
          >
            Swap
          </Button>
          <Button
            color={mode === "buy" ? "gray.600" : "gray.300"}
            fontWeight="medium"
            variant="link"
            onClick={() => setMode("buy")}
          >
            Buy
          </Button>
        </Flex>
        <IconButton aria-label="btn-setting" bg="transparent">
          <SettingsIcon color="gray.600" boxSize={6} />
        </IconButton>
      </Flex>
    </Box>
  );
}
