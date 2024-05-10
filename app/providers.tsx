// app/providers.tsx
"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "~/app/themes/theme";
import { Web3Modal } from "~/app/containers/Web3Modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3Modal>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </Web3Modal>
  );
}
