"use client"

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react"

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID as string

// 2. Set chains
const chains = [
  {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  },
  {
    chainId: 43113,
    name: "Avalanche Fuji",
    currency: "AVAX",
    explorerUrl: "https://testnet.snowscan.xyz",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
  },
  {
    chainId: 97,
    name: "Binance Smart Chain Testnet",
    currency: "BNB",
    explorerUrl: "https://testnet.bscscan.com",
    rpcUrl: "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
  },
]

// 3. Create a metadata object
const metadata = {
  name: "SwapyApp",
  description: "Instant swap platform for cryptocurrencies.",
  url: "https://swapy.zzuls.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
}
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  tokens: {
    1: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    },
  },
})

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return children
}
