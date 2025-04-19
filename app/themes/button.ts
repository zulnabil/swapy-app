import { defineStyleConfig } from "@chakra-ui/react";

export const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: "full",
    fontWeight: "medium",
    _focus: {
      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.4)",
    },
    transition: "all 0.2s ease",
  },
  variants: {
    solid: {
      paddingLeft: 8,
      paddingRight: 8,
      bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      color: "white",
      _hover: {
        bgGradient: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
        transform: "translateY(-1px)",
        boxShadow: "0 6px 20px rgba(124, 58, 237, 0.25)",
      },
      _active: {
        bgGradient: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
        transform: "translateY(0)",
      },
    },
    glass: {
      bg: "rgba(255, 255, 255, 0.15)",
      backdropFilter: "blur(10px)",
      color: "gray.700",
      borderWidth: "1px",
      borderColor: "rgba(255, 255, 255, 0.3)",
      _hover: {
        bg: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 6px 20px rgba(124, 58, 237, 0.15)",
      },
    },
    outline: {
      borderColor: "brand.300",
      color: "brand.600",
      _hover: {
        bg: "brand.50",
        transform: "translateY(-1px)",
      },
    },
    ghost: {
      color: "gray.600",
      _hover: {
        bg: "rgba(139, 92, 246, 0.1)",
      },
    },
    link: {
      position: "relative",
      _after: {
        content: '""',
        position: "absolute",
        width: "0%",
        height: "2px",
        bottom: "-2px",
        left: "0",
        bg: "brand.500",
        transition: "width 0.3s ease",
      },
      _hover: {
        textDecoration: "none",
        color: "brand.500",
        _after: {
          width: "100%",
        },
      },
      _active: {
        color: "brand.600",
      },
    },
    subtle: {
      bg: "brand.50",
      color: "brand.600",
      _hover: {
        bg: "brand.100",
      },
    },
    neon: {
      bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      color: "white",
      boxShadow: "0 0 15px rgba(139, 92, 246, 0.6)",
      _hover: {
        boxShadow: "0 0 25px rgba(139, 92, 246, 0.8)",
        transform: "translateY(-2px)",
      },
    },
  },
  sizes: {
    xl: {
      h: "56px",
      fontSize: "lg",
      px: "32px",
    },
  },
  defaultProps: {
    variant: "solid",
  },
});
