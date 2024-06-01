"use client";

import { Squid } from "@0xsquid/sdk";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Swap from "~/app/containers/Swap";
import { MainContextProvider } from "~/app/contexts/MainContext";
import { SplashScreen } from "./components/SplashScreen";

export default function Main() {
  const [squid, setSquid] = useState<Squid | null>(null);

  useEffect(() => {
    // Initialize Squid SDK and set it to state
    async function initiateSquid() {
      const squid = new Squid();
      squid.setConfig({
        baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL,
        integratorId: process.env.NEXT_PUBLIC_INTEGRATOR_ID,
      });
      await squid.init();
      setSquid(squid);
    }
    initiateSquid();
  }, []);

  return (
    // Wrap Swap component with MainContextProvider and pass squid as prop
    <MainContextProvider squid={squid}>
      <SplashScreen />
      <Flex as="main" py="4" justify="center">
        <Swap />
      </Flex>
    </MainContextProvider>
  );
}
