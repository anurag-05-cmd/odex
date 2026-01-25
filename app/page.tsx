"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ["Exchanging", "Reselling", "Trading", "Swapping", "Vending"];

  useEffect(() => {
    const word = words[currentWord];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 0 : 1500;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === word) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setCurrentWord((prev) => (prev + 1) % words.length);
      } else if (isDeleting) {
        setDisplayText(word.substring(0, displayText.length - 1));
      } else {
        setDisplayText(word.substring(0, displayText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWord]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#70ff00]/3 rounded-full blur-[120px]"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative min-h-screen flex items-center px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#70ff00] rounded-full animate-pulse"></span>
              <span className="text-white/80 text-sm">Trustless P2P Trading Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-nabla)' }}>
              <span className="text-white">Trade without</span>
              <br />
              <span className="text-[#70ff00]">
                intermediaries
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 px-4">
              Dual-stake escrow ensures both parties are committed to honest transactions. No middleman, no trust required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/marketplace" className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#70ff00] via-[#5acc00] to-[#70ff00] text-black rounded-xl font-bold text-lg overflow-hidden transition-all duration-500 ease-out hover:shadow-[0_0_50px_rgba(112,255,0,0.6),0_0_80px_rgba(112,255,0,0.3),inset_0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative z-10">Start</span>
                <span className="relative z-10 inline-block transition-all duration-200 ease-in-out" style={{ minWidth: `${displayText.length * 0.6}em` }}>
                  {displayText}<span className="animate-pulse ml-0.5">|</span>
                </span>
                <svg className="relative z-10 w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/10 to-transparent"></div>
              </Link>
              <Link href="/about" className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/20 text-white rounded-xl font-semibold text-lg backdrop-blur-xl transition-all duration-500 ease-out hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 hover:border-[#70ff00]/50 hover:shadow-[0_0_30px_rgba(112,255,0,0.2)] hover:scale-[1.02] active:scale-[0.98]">
                Learn More
                <svg className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              {
                step: "01",
                title: "List Item",
                description: "Seller creates listing with wallet signature"
              },
              {
                step: "02",
                title: "Dual Stake",
                description: "Buyer 2x • Seller 1.5x item value"
              },
              {
                step: "03",
                title: "Ship & Confirm",
                description: "5-min window or auto-refund"
              },
              {
                step: "04",
                title: "Complete",
                description: "Buyer confirms, funds released"
              }
            ].map((item, index) => (
              <div key={index} className="group relative p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-white/10 rounded-2xl backdrop-blur-xl hover:bg-gradient-to-br hover:from-white/15 hover:to-white/5 hover:border-[#70ff00]/30 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3),0_0_40px_rgba(112,255,0,0.1)] hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#70ff00]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -top-2 -left-2 w-20 h-20 bg-[#70ff00]/5 rounded-full blur-2xl group-hover:bg-[#70ff00]/10 transition-colors duration-500"></div>
                <div className="text-[#70ff00]/30 group-hover:text-[#70ff00]/60 text-4xl font-bold mb-4 transition-colors duration-500 drop-shadow-[0_0_10px_rgba(112,255,0,0.3)]">{item.step}</div>
                <h3 className="text-white text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-[#70ff00]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Trustless Escrow</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Both parties stake funds ensuring commitment and honest trading behavior.
              </p>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-[#70ff00]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Auto Protection</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automatic refunds if seller doesn't confirm within 5 minutes.
              </p>
            </div>

            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-[#70ff00]/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Dispute Free</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mutual stakes create natural incentives for honest behavior.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
