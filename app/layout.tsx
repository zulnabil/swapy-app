import type { Metadata } from "next";
import { Providers } from "./providers";
import { fonts } from "./fonts";
import Header from "~/app/containers/Header";

export const metadata: Metadata = {
  title: "Swapy App",
  description: "Instant swap platform for cryptocurrencies.",
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
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
