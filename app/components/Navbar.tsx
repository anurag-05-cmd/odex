"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createAppKit, useAppKitAccount } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum, sepolia } from "@reown/appkit/networks";

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

// 2. Set up the Ethers Adapter
const ethersAdapter = new EthersAdapter();

// 3. Create the modal
const metadata = {
  name: "Odex",
  description: "The next generation decentralized exchange platform",
  url: "https://odex.expose.software",
  icons: ["/logo_dark.png"],
};

const modal = createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks: [mainnet, arbitrum, sepolia],
  defaultNetwork: sepolia,
  metadata,
  features: {
    analytics: true,
  },
});

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center cursor-pointer">
          <Image
            src="/logo_dark.png"
            alt="Odex Logo"
            width={70}
            height={70}
            priority
          />
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-8">
          <Link
            href="/marketplace"
            className="relative overflow-hidden text-sm font-medium transition-colors h-5 text-white hover:text-[#70ff00]"
          >
            <span className="inline-block hover:animate-[text-scroll_0.5s_linear]">
              <span className="block">Marketplace</span>
              <span className="block">Marketplace</span>
            </span>
          </Link>
          <Link
            href="/listings"
            className="relative overflow-hidden text-sm font-medium transition-colors h-5 text-white hover:text-[#70ff00]"
          >
            <span className="inline-block hover:animate-[text-scroll_0.5s_linear]">
              <span className="block">Listings</span>
              <span className="block">Listings</span>
            </span>
          </Link>
          <Link
            href="/faucet"
            className="relative overflow-hidden text-sm font-medium transition-colors h-5 text-white hover:text-[#70ff00]"
          >
            <span className="inline-block hover:animate-[text-scroll_0.5s_linear]">
              <span className="block">Faucet</span>
              <span className="block">Faucet</span>
            </span>
          </Link>
          <Link
            href="/about"
            className="relative overflow-hidden text-sm font-medium transition-colors h-5 text-white hover:text-[#70ff00]"
          >
            <span className="inline-block hover:animate-[text-scroll_0.5s_linear]">
              <span className="block">About</span>
              <span className="block">About</span>
            </span>
          </Link>
        </div>

        {/* Connect Wallet Button */}
        {mounted && (
          isConnected && address ? (
            <button
              onClick={() => modal?.open()}
              className="relative bg-white/5 border border-[#70ff00]/50 text-[#70ff00] px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(112,255,0,0.6)] overflow-hidden group"
            >
              <span className="relative z-10">{formatAddress(address)}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#70ff00]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          ) : (
            <button
              onClick={() => modal?.open()}
              className="relative bg-[#70ff00] text-black px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(112,255,0,0.6)] overflow-hidden group"
            >
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          )
        )}
      </div>
    </nav>
  );
}
