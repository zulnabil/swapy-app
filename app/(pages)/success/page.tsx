"use client";

import { Box, Flex, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

export default function SuccessPage() {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    setIsExploding(true);
    // setTimeout(() => {
    //   setIsExploding(false);
    // }, 5000);
  }, []);

  return (
    <Flex as="main" py="4" justify="center">
      <VStack spacing="5" w="full" bg="white" maxW="lg" rounded="2xl" p="8">
        <Text fontSize="xxx-large">🎉</Text>
        <Text>Success Swap</Text>
      </VStack>
      <ConfettiExplosion force={0.8} duration={3000} width={1600} />
      {/* {isExploding && } */}
    </Flex>
  );
}
