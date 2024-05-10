import { Flex } from "@chakra-ui/react";
import Swap from "~/app/containers/Swap";

export default function Home() {
  return (
    <Flex as="main" py="4" justify="center">
      <Swap />
    </Flex>
  );
}
