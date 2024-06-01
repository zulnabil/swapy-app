import { Box, Heading, Highlight } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const MotionBox = motion(Box);

export const SplashScreen = () => {
  useEffect(() => {
    // after 3 seconds, remove the splash screen
    setTimeout(() => {
      document.getElementById("splash-screen")?.remove();
    }, 3000);
  }, []);
  return (
    <Box id="splash-screen">
      <Box
        w="100vw"
        h="100svh"
        position="fixed"
        top="0"
        left="0"
        zIndex={10000}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <MotionBox
          animate={{
            scale: [0.5, 1, 1, 1, 1],
            opacity: [0, 1, 1, 0, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            ttimes: [0, 0.2, 0.5, 0.8, 1],
          }}
        >
          <Heading as="h1" size="lg" color="brand.500" fontWeight="bold">
            <Highlight query="App" styles={{ color: "gray.800" }}>
              SwapyApp
            </Highlight>
          </Heading>
        </MotionBox>
      </Box>
      <MotionBox
        w="100vw"
        h="100svh"
        position="fixed"
        top="0"
        left="0"
        zIndex={9999}
        bg="brand.500"
        display="flex"
        justifyContent="center"
        alignItems="center"
        animate={{
          opacity: [1, 1, 1, 0, 0],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          ttimes: [0, 0.2, 0.5, 0.8, 1],
        }}
      >
        <MotionBox
          w="35svh"
          h="35svh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          rounded="100%"
          bg="white"
          animate={{
            scale: [0.5, 1, 1, 8, 8],
            opacity: [1, 1, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            ttimes: [0, 0.2, 0.5, 0.8, 1],
          }}
        ></MotionBox>
      </MotionBox>
    </Box>
  );
};
