/* theme.ts */
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";

export const theme = extendTheme({
  colors: {
    brand: {
      50: "#F7F4FF",
      100: "#EDE6FF",
      200: "#D9CBFF",
      300: "#C6B0FF",
      400: "#B396FF",
      500: "#9F7AFA",
      600: "#8B5CF6",
      700: "#7C3AED",
      800: "#6D28D9",
      900: "#5B21B6",
      bg: "rgba(247, 244, 255, 0.9)",
      bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      bgDark: "#2E1065",
      bgInput: "rgba(255, 255, 255, 0.7)",
      accent: "#F472B6",
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      darkBlue: "#0F172A",
    },
    gray: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
  },
  shadows: {
    glassShadow: "0 8px 32px rgba(124, 58, 237, 0.1)",
    cardShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    hoverShadow: "0 10px 25px rgba(124, 58, 237, 0.2)",
    neonShadow: "0 0 20px rgba(139, 92, 246, 0.6)",
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
        bgImage: "url('/images/mesh-gradient.png')",
        bgSize: "cover",
        bgPosition: "center",
        bgAttachment: "fixed",
      },
    },
  },
  components: {
    Button,
    Text: {
      baseStyle: {
        color: "gray.600",
      },
    },
    Box: {
      variants: {
        glass: {
          bg: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
          borderRadius: "xl",
          boxShadow: "glassShadow",
          borderWidth: "1px",
          borderColor: "rgba(255, 255, 255, 0.3)",
        },
        card: {
          bg: "white",
          borderRadius: "xl",
          boxShadow: "cardShadow",
          transition: "all 0.3s ease",
          _hover: {
            boxShadow: "hoverShadow",
            transform: "translateY(-2px)",
          },
        },
      },
    },
  },
  fonts: {
    heading: "var(--font-rubik)",
    body: "var(--font-rubik)",
  },
  layerStyles: {
    gradientBg: {
      bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
      color: "white",
    },
    glassmorphism: {
      bg: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
      borderColor: "rgba(255, 255, 255, 0.3)",
      borderWidth: "1px",
    },
  },
});
