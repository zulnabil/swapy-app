"use client";

import {
  Box,
  Flex,
  Input,
  InputProps,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface Props extends Omit<InputProps, "onChange"> {
  name: string;
  isLoading?: boolean;
  onChange?: (value: string) => void;
  label?: React.ReactNode | string;
  balanceElement?: React.ReactNode;
  chainElement?: React.ReactNode;
  tokenElement?: React.ReactNode;
  addressElement?: React.ReactNode;
}

export default function SwapInput({
  name,
  isLoading,
  onChange,
  label = "You pay",
  balanceElement,
  chainElement,
  tokenElement,
  addressElement,
  ...props
}: Props) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      position="relative"
      // zIndex={props.zIndex || 1}
    >
      <VStack
        p="6"
        rounded="xl"
        align="flex-start"
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(10px)"
        borderWidth="1px"
        borderColor="rgba(255, 255, 255, 0.5)"
        boxShadow="0 4px 20px rgba(139, 92, 246, 0.08)"
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "0 8px 30px rgba(139, 92, 246, 0.12)",
          transform: "translateY(-2px)",
        }}
        spacing={3}
      >
        <Flex justify="space-between" align="center" w="full">
          <MotionFlex
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {chainElement}
          </MotionFlex>
          <MotionFlex
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {addressElement}
          </MotionFlex>
        </Flex>

        <Flex justify="space-between" align="center" color="gray.500" w="full">
          <Skeleton
            isLoaded={!isLoading}
            startColor="brand.100"
            endColor="brand.50"
          >
            <Text fontWeight="medium" fontSize="sm" id={name} color="gray.600">
              {label}
            </Text>
          </Skeleton>
          <MotionFlex whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            {balanceElement}
          </MotionFlex>
        </Flex>

        <Flex justify="space-between" align="center" gap="3" w="full">
          <Skeleton
            isLoaded={!isLoading}
            w="full"
            startColor="brand.100"
            endColor="brand.50"
          >
            <Input
              name={name}
              placeholder="0.0"
              variant="unstyled"
              fontSize="3xl"
              fontWeight="bold"
              type="number"
              color="gray.800"
              _focus={{
                outline: "none",
              }}
              onChange={(event) => onChange && onChange(event.target.value)}
              {...props}
              // zIndex="1"
            />
          </Skeleton>
          <MotionFlex
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {tokenElement}
          </MotionFlex>
        </Flex>

        {/* Decorative element */}
        <Box
          position="absolute"
          top="-5px"
          right="30px"
          width="60px"
          height="10px"
          bg="brand.500"
          opacity="0.2"
          borderRadius="full"
          zIndex="-1"
        />
      </VStack>
    </MotionBox>
  );
}
