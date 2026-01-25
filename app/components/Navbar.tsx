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
  networks: [sepolia],
  defaultNetwork: sepolia,
  metadata,
  features: {
    analytics: true,
  },
});

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navLinks = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/listings", label: "My Listings" },
    { href: "/buyer-trades", label: "My Stakes" },
    { href: "/faucet", label: "Faucet" },
    { href: "/about", label: "About" },
  ];

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 md:px-6 py-2 md:py-2.5 flex items-center justify-between shadow-[0_8px_32px_0_rgba(112,255,0,0.1)] hover:shadow-[0_8px_32px_0_rgba(112,255,0,0.2)] transition-all duration-500">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] relative">
              <Image
                src="/logo_dark.png"
                alt="Odex Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative overflow-hidden text-sm font-semibold transition-all duration-300 h-5 text-white/90 hover:text-[#70ff00] hover:drop-shadow-[0_0_8px_rgba(112,255,0,0.8)]"
              >
                <span className="inline-block hover:animate-[text-scroll_0.5s_linear]">
                  <span className="block">{link.label}</span>
                  <span className="block">{link.label}</span>
                </span>
              </Link>
            ))}
          </div>

          {/* Right Side - Wallet + Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Connect Wallet Button */}
            {mounted && (
              isConnected && address ? (
                <button
                  onClick={() => modal?.open()}
                  className="relative bg-gradient-to-r from-[#70ff00]/10 to-[#70ff00]/5 border-2 border-[#70ff00]/50 text-[#70ff00] px-4 md:px-6 py-2 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(112,255,0,0.8)] hover:border-[#70ff00] overflow-hidden group backdrop-blur-sm"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#70ff00] rounded-full animate-pulse"></span>
                    {formatAddress(address)}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#70ff00]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              ) : (
                <button
                  onClick={() => modal?.open()}
                  className="relative bg-gradient-to-r from-[#70ff00] to-[#5acc00] text-black px-4 md:px-6 py-2 rounded-full font-bold text-xs md:text-sm transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(112,255,0,0.8),0_0_60px_rgba(112,255,0,0.4)] overflow-hidden group"
                >
                  <span className="relative z-10">Connect</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              )
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(112,255,0,0.1)] animate-[slideDown_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-[#70ff00] font-semibold text-lg py-4 px-5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-[#70ff00]/10 hover:to-[#70ff00]/5 transition-all duration-300 border-2 border-white/20 hover:border-[#70ff00]/50 hover:shadow-[0_0_20px_rgba(112,255,0,0.3)] backdrop-blur-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
