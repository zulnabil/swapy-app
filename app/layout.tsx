import type { Metadata } from "next"
import { Providers } from "./providers"
import { fonts } from "./fonts"
import Header from "~/app/containers/Header"
import { Box, Container } from "@chakra-ui/react"

export const metadata: Metadata = {
  title: "Swapy App",
  description: "Instant swap platform for cryptocurrencies.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <Providers>
          <Header />
          <Box bg="brand.bg">
            <Container
              maxW="container.lg"
              minH="calc(100svh - 80px)"
              h="100%"
              p="5"
            >
              {children}
            </Container>
          </Box>
        </Providers>
      </body>
    </html>
  )
}
