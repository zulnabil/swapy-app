"use client";

import { ChakraProps, IconButton, IconButtonProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ArrowDownIcon } from "@chakra-ui/icons";

const MotionIconButton = motion(IconButton);

type Props = Omit<IconButtonProps, "aria-label"> & ChakraProps;

export default function ButtonReverse(props: Props) {
  return (
    <MotionIconButton
      colorScheme="brand"
      variant="neon"
      size="lg"
      rounded="full"
      boxShadow="0 0 15px rgba(87, 134, 251, 0.4)"
      zIndex={2}
      position="relative"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      _hover={{
        transform: "none", // Letting framer-motion handle this
      }}
      {...props}
      aria-label="btn-reverse"
      icon={
        <motion.div
          animate={{ rotate: [0, 180, 360], y: [0, -2, 0, 2, 0] }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ArrowDownIcon boxSize={5} />
        </motion.div>
      }
    />
  );
}
