import type { Metadata } from "next";
import { Providers } from "./providers";
import { fonts } from "./fonts";
import Header from "~/app/containers/Header";
import { Box, Container } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Swapy App | Next-Gen Crypto Swap Platform",
  description:
    "The most efficient crypto swap platform powered by AI for the best rates across multiple chains.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <Providers>
          {/* Animated background elements */}
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex="-1"
            bgGradient="linear-gradient(135deg, rgba(247, 244, 255, 0.8) 0%, rgba(237, 230, 255, 0.8) 100%)"
            overflow="hidden"
          >
            {/* Decorative elements */}
            <Box
              position="absolute"
              top="-10%"
              right="-5%"
              width="500px"
              height="500px"
              borderRadius="full"
              bgGradient="radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.1) 70%)"
              filter="blur(60px)"
            />
            <Box
              position="absolute"
              bottom="-15%"
              left="-10%"
              width="600px"
              height="600px"
              borderRadius="full"
              bgGradient="radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.05) 70%)"
              filter="blur(80px)"
            />
            <Box
              position="absolute"
              top="30%"
              left="10%"
              width="300px"
              height="300px"
              borderRadius="full"
              bgGradient="radial-gradient(circle, rgba(244, 114, 182, 0.2) 0%, rgba(244, 114, 182, 0.05) 70%)"
              filter="blur(40px)"
            />
          </Box>

          <Header />
          <Box>
            <Container
              maxW="container.xl"
              minH="calc(100svh - 80px)"
              h="100%"
              py="8"
              px={{ base: "4", md: "6" }}
            >
              {children}
            </Container>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
