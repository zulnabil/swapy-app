import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // after 3 seconds, start the exit animation
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // After 4 seconds, remove the splash screen element
    const removeTimer = setTimeout(() => {
      document.getElementById("splash-screen")?.remove();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <Box id="splash-screen">
          <MotionBox
            key="splash-overlay"
            w="100vw"
            h="100svh"
            position="fixed"
            top="0"
            left="0"
            zIndex={10000}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: "easeInOut" },
            }}
          >
            <MotionFlex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              gap="4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.6,
              }}
            >
              <MotionBox
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.34, 1.56, 0.64, 1], // spring-like bounce
                  delay: 0.2,
                }}
              >
                <Box
                  position="relative"
                  width="100px"
                  height="100px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  {/* Outer ring with gradient */}
                  <MotionBox
                    position="absolute"
                    width="100px"
                    height="100px"
                    borderRadius="full"
                    bgGradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(139, 92, 246, 0.6)",
                        "0 0 30px rgba(139, 92, 246, 0.6)",
                        "0 0 15px rgba(139, 92, 246, 0.6)",
                      ],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Inner circle */}
                  <MotionBox
                    position="absolute"
                    width="70px"
                    height="70px"
                    borderRadius="full"
                    bg="white"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {/* Icon or Symbol */}
                    <MotionBox
                      width="30px"
                      height="30px"
                      borderRadius="lg"
                      bgGradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
                      initial={{ rotate: 45 }}
                      animate={{ rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    />
                  </MotionBox>
                </Box>
              </MotionBox>

              <MotionHeading
                as="h1"
                size="xl"
                fontWeight="bold"
                bgGradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
                bgClip="text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                SwapyApp
              </MotionHeading>

              <MotionText
                fontSize="md"
                color="gray.500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                Next-gen crypto swap platform
              </MotionText>
            </MotionFlex>
          </MotionBox>

          <MotionBox
            key="splash-bg"
            w="100vw"
            h="100svh"
            position="fixed"
            top="0"
            left="0"
            zIndex={9999}
            bgGradient="linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
              times: [0, 0.7, 1],
              ease: "easeInOut",
            }}
          >
            {/* Background particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <MotionBox
                key={`particle-${i}`}
                position="absolute"
                width={`${Math.random() * 15 + 5}px`}
                height={`${Math.random() * 15 + 5}px`}
                bg="rgba(255, 255, 255, 0.2)"
                borderRadius="full"
                left={`${Math.random() * 100}%`}
                top={`${Math.random() * 100}%`}
                initial={{ opacity: 0.2, scale: 0 }}
                animate={{
                  opacity: [0.2, 0.8, 0],
                  scale: [0, 1, 1.5],
                  y: [0, -20, -40],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  ease: "easeOut",
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 3,
                }}
              />
            ))}
          </MotionBox>
        </Box>
      )}
    </AnimatePresence>
  );
};
