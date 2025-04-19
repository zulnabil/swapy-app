"use client";

import { Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Swap from "~/app/containers/Swap";
import { MainContextProvider } from "~/app/contexts/MainContext";
import { SplashScreen } from "./components/SplashScreen";
import { Squid } from "@0xsquid/sdk";

export default function Main() {
  const [squid, setSquid] = useState<Squid | null>(null);

  useEffect(() => {
    // Initialize Squid SDK and set it to state
    async function initiateSquid() {
      const squid = new Squid({
        baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
        integratorId: process.env.NEXT_PUBLIC_INTEGRATOR_ID || "",
      });
      squid.init();
      setSquid(squid);
    }
    initiateSquid();
  }, []);

  return (
    // Wrap Swap component with MainContextProvider and pass squid as prop
    <MainContextProvider squid={squid}>
      <SplashScreen />
      <Flex
        as="main"
        py="6"
        justify="center"
        align="center"
        flexDir="column"
        gap="10"
      >
        <Heading as="h2" size="md" color="gray.600">
          Using AI to aggregate the best rates such as Jupiter, OKX, and more to
          get the cheapest swap fees.
        </Heading>
        <Swap />
      </Flex>
    </MainContextProvider>
  );
}
