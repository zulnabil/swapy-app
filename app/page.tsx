"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Swap from "~/app/containers/Swap";
import { MainContextProvider } from "~/app/contexts/MainContext";
import { SplashScreen } from "./components/SplashScreen";
import { Squid } from "@0xsquid/sdk";
import {
  FiArrowRight,
  FiCheck,
  FiGlobe,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactElement;
  title: string;
  description: string;
}) => (
  <MotionBox
    p="6"
    borderRadius="xl"
    bg="white"
    boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
    height="100%"
    transition="all 0.3s ease"
    whileHover={{ y: -5, boxShadow: "0 8px 30px rgba(87, 134, 251, 0.15)" }}
  >
    <Flex direction="column" gap="4">
      <Flex
        w="50px"
        h="50px"
        bg="brand.50"
        color="brand.500"
        borderRadius="lg"
        justify="center"
        align="center"
      >
        {icon}
      </Flex>
      <Heading size="md" fontWeight="bold" color="gray.800">
        {title}
      </Heading>
      <Text color="gray.500">{description}</Text>
    </Flex>
  </MotionBox>
);

const NetworkBadge = ({ name }: { name: string }) => (
  <MotionBox
    px="4"
    py="2"
    bg="white"
    color="gray.700"
    fontWeight="medium"
    borderRadius="full"
    boxShadow="0 2px 10px rgba(0, 0, 0, 0.05)"
    whileHover={{
      scale: 1.05,
      boxShadow: "0 4px 15px rgba(87, 134, 251, 0.15)",
    }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    {name}
  </MotionBox>
);

export default function Main() {
  const [squid, setSquid] = useState<Squid | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

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

      {/* Fullscreen Swap Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="rgba(0, 0, 0, 0.2)" backdropFilter="blur(10px)" />
        <ModalContent
          bg="transparent"
          boxShadow="none"
          mx="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pt={{ base: "16", md: "24" }}
          pb={{ base: "8", md: "12" }}
        >
          <ModalCloseButton
            color="white"
            bg="rgba(255, 255, 255, 0.1)"
            borderRadius="full"
            size="lg"
            top="4"
            right="4"
            zIndex={10}
            _hover={{
              bg: "rgba(255, 255, 255, 0.2)",
            }}
          />
          <Box maxW="lg" w="full" mx="auto" px={{ base: "4", md: "0" }}>
            <MotionBox
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Swap />
            </MotionBox>
          </Box>
        </ModalContent>
      </Modal>

      <Container maxW="container.xl" py="12">
        {/* Hero Section */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: "10", lg: "16" }}
          mb="24"
        >
          <GridItem>
            <Stack spacing="8" justifyContent="center" height="100%">
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  display="inline-block"
                  px="3"
                  py="1"
                  bg="brand.50"
                  color="brand.500"
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="medium"
                  mb="4"
                >
                  AI-Powered Swap Platform
                </Box>
                <MotionHeading
                  as="h1"
                  size="2xl"
                  fontWeight="extrabold"
                  lineHeight="1.2"
                  bgGradient="linear-gradient(135deg, gray.800 0%, brand.500 50%, gray.800 100%)"
                  bgClip="text"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  The Smartest Way to Swap Your Crypto
                </MotionHeading>
                <MotionText
                  fontSize="xl"
                  color="gray.500"
                  mt="4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Using AI to aggregate the best rates across Jupiter, OKX, and
                  more to get the cheapest swap fees.
                </MotionText>
              </MotionBox>

              <HStack spacing="4" wrap="wrap">
                <Button
                  size="lg"
                  colorScheme="brand"
                  variant="solid"
                  rightIcon={<Icon as={FiArrowRight} />}
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpen}
                >
                  Start Swapping
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </Button>
              </HStack>

              <HStack spacing="4" mt="6" wrap="wrap">
                <Text color="gray.600" fontWeight="medium">
                  Supported Networks:
                </Text>
                <NetworkBadge name="Ethereum" />
                <NetworkBadge name="Polygon" />
                <NetworkBadge name="Solana" />
                <NetworkBadge name="BSC" />
                <NetworkBadge name="Avalanche" />
              </HStack>
            </Stack>
          </GridItem>

          <GridItem
            display={{ base: "none", lg: "flex" }}
            justifyContent={{ base: "center", lg: "flex-end" }}
            alignItems="center"
          >
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Swap />
            </MotionBox>
          </GridItem>
        </Grid>

        {/* Features Section */}
        <Box mb="24">
          <Flex direction="column" align="center" mb="12">
            <MotionHeading
              textAlign="center"
              as="h2"
              size="xl"
              fontWeight="bold"
              mb="4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Why Choose SwapyApp
            </MotionHeading>
            <MotionText
              textAlign="center"
              color="gray.500"
              fontSize="lg"
              maxW="container.md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our platform provides the ultimate experience for cryptocurrency
              swaps with features that set us apart from the competition.
            </MotionText>
          </Flex>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap="6"
          >
            <FeatureCard
              icon={<Icon as={FiTrendingUp} boxSize="6" />}
              title="Best Rates Guaranteed"
              description="Our AI aggregates the best rates from multiple DEXs to ensure you always get the most tokens for your swap."
            />
            <FeatureCard
              icon={<Icon as={FiGlobe} boxSize="6" />}
              title="Cross-Chain Swaps"
              description="Easily swap between tokens on different blockchains with our seamless cross-chain bridge functionality."
            />
            <FeatureCard
              icon={<Icon as={FiShield} boxSize="6" />}
              title="Secure Transactions"
              description="All transactions are non-custodial and secure, giving you full control of your assets at all times."
            />
          </Grid>
        </Box>

        {/* Stats Section */}
        <Flex
          direction="column"
          align="center"
          bg="brand.50"
          p="10"
          borderRadius="2xl"
          mb="24"
          position="relative"
          overflow="hidden"
        >
          {/* Decorative elements */}
          <Box
            position="absolute"
            top="-50px"
            right="-50px"
            width="200px"
            height="200px"
            bg="brand.100"
            borderRadius="full"
            opacity="0.5"
            zIndex="0"
          />
          <Box
            position="absolute"
            bottom="-80px"
            left="-80px"
            width="250px"
            height="250px"
            bg="brand.100"
            borderRadius="full"
            opacity="0.3"
            zIndex="0"
          />

          <MotionHeading
            as="h2"
            size="lg"
            fontWeight="bold"
            mb="10"
            textAlign="center"
            zIndex="1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Trusted by Thousands of Crypto Traders
          </MotionHeading>

          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap="8"
            width="100%"
            zIndex="1"
          >
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Heading color="brand.500" size="2xl" fontWeight="bold">
                $1B+
              </Heading>
              <Text color="gray.600" mt="2">
                Total Volume
              </Text>
            </MotionBox>
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Heading color="brand.500" size="2xl" fontWeight="bold">
                40K+
              </Heading>
              <Text color="gray.600" mt="2">
                Active Users
              </Text>
            </MotionBox>
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Heading color="brand.500" size="2xl" fontWeight="bold">
                10+
              </Heading>
              <Text color="gray.600" mt="2">
                Blockchains
              </Text>
            </MotionBox>
            <MotionBox
              textAlign="center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Heading color="brand.500" size="2xl" fontWeight="bold">
                0.1%
              </Heading>
              <Text color="gray.600" mt="2">
                Average Fee
              </Text>
            </MotionBox>
          </Grid>
        </Flex>

        {/* CTA Section */}
        <MotionBox
          bg="gray.900"
          borderRadius="2xl"
          p="10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          position="relative"
          overflow="hidden"
        >
          {/* Background gradient effects */}
          <Box
            position="absolute"
            top="-50%"
            left="-10%"
            width="60%"
            height="200%"
            bgGradient="linear-gradient(135deg, brand.700 0%, transparent 70%)"
            opacity="0.1"
            transform="rotate(20deg)"
            zIndex="0"
          />
          <Box
            position="absolute"
            bottom="-50%"
            right="-10%"
            width="70%"
            height="200%"
            bgGradient="linear-gradient(135deg, brand.600 0%, transparent 70%)"
            opacity="0.1"
            transform="rotate(20deg)"
            zIndex="0"
          />

          <Grid
            templateColumns={{ base: "1fr", md: "2fr 1fr" }}
            gap="8"
            zIndex="1"
            position="relative"
          >
            <GridItem>
              <Heading color="white" size="lg" fontWeight="bold" mb="4">
                Ready to Experience the Future of Crypto Swapping?
              </Heading>
              <Text color="gray.300" mb="6">
                Start trading with SwapyApp today and discover why thousands of
                traders trust us for their daily crypto swaps.
              </Text>
              <HStack>
                <Button
                  colorScheme="brand"
                  size="lg"
                  rightIcon={<Icon as={FiArrowRight} />}
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpen}
                >
                  Start Now
                </Button>
              </HStack>
            </GridItem>

            <GridItem>
              <Stack spacing="4">
                <Flex align="center" gap="3">
                  <Flex
                    w="8"
                    h="8"
                    bg="brand.500"
                    color="white"
                    borderRadius="full"
                    justify="center"
                    align="center"
                  >
                    <Icon as={FiCheck} />
                  </Flex>
                  <Text color="white">Best rates across all exchanges</Text>
                </Flex>
                <Flex align="center" gap="3">
                  <Flex
                    w="8"
                    h="8"
                    bg="brand.500"
                    color="white"
                    borderRadius="full"
                    justify="center"
                    align="center"
                  >
                    <Icon as={FiCheck} />
                  </Flex>
                  <Text color="white">Low fees and gas optimization</Text>
                </Flex>
                <Flex align="center" gap="3">
                  <Flex
                    w="8"
                    h="8"
                    bg="brand.500"
                    color="white"
                    borderRadius="full"
                    justify="center"
                    align="center"
                  >
                    <Icon as={FiCheck} />
                  </Flex>
                  <Text color="white">Cross-chain swaps in seconds</Text>
                </Flex>
              </Stack>
            </GridItem>
          </Grid>
        </MotionBox>
      </Container>
    </MainContextProvider>
  );
}
