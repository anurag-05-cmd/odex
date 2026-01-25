"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, TRADE_STATES, IPFS_GATEWAYS } from "../utils/constants";
import { useNotification } from "../contexts/NotificationContext";

interface Trade {
  tradeId: string;
  seller: string;
  buyer: string;
  price: string;
  category: string;
  status: "waiting_seller" | "in_progress" | "released" | "completed" | "refunded";
  title: string;
  description: string;
  image?: string;
  contractState: number;
  activationTime?: number;
}

interface RawTrade {
  tradeId: number;
  seller: string;
  buyer: string;
  price: bigint;
  sellerStake: bigint;
  buyerStake: bigint;
  activationTime: number;
  state: number;
}

export default function BuyerTrades() {
  const { showNotification } = useNotification();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");

  // Initialize contract
  useEffect(() => {
    initializeContract();
  }, []);

  // Load buyer's trades when contract is ready
  useEffect(() => {
    if (contract && userAddress) {
      loadBuyerTrades();
      // Refresh every 30 seconds
      const interval = setInterval(loadBuyerTrades, 30000);
      return () => clearInterval(interval);
    }
  }, [contract, userAddress]);

  const initializeContract = async () => {
    try {
      if (typeof window === 'undefined') {
        console.error("Window object not available");
        return;
      }

      // Wait for ethereum provider to be available (handles ngrok/cross-origin delays)
      let provider: ethers.BrowserProvider | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (!provider && attempts < maxAttempts) {
        if (window.ethereum) {
          try {
            provider = new ethers.BrowserProvider(window.ethereum as any);
            console.log("✓ Ethereum provider initialized (BuyerTrades)");
            break;
          } catch (err) {
            console.log(`Attempt ${attempts + 1}/${maxAttempts}: Provider initialization failed, retrying...`);
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            console.log(`Attempt ${attempts + 1}/${maxAttempts}: Waiting for window.ethereum...`);
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }

      if (!provider) {
        console.error("MetaMask not detected");
        return;
      }
      
      if (!CONTRACT_ADDRESS) {
        console.error("Contract address not set");
        return;
      }
      
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
        setUserAddress(accounts[0]);
        console.log("✓ Contract initialized (BuyerTrades)");
      } catch (error: any) {
        console.error("Error connecting wallet:", error);
        if (error.message?.includes("could not coalesce")) {
          console.error("Cross-origin provider issue. Retrying...");
          setTimeout(initializeContract, 2000);
        }
      }
    } catch (error: any) {
      console.error("Error initializing contract:", error);
      if (error.message?.includes("could not coalesce")) {
        console.error("Cross-origin provider issue detected. Retrying...");
        setTimeout(initializeContract, 2000);
      }
    }
  };

  const getBuyerTradeStatus = (state: number): { status: Trade['status'], displayText: string, color: string } => {
    switch (state) {
      case TRADE_STATES.CREATED:
        return { status: "waiting_seller", displayText: "Waiting for You to Stake", color: "yellow" };
      case TRADE_STATES.BUYER_STAKED:
        return { status: "waiting_seller", displayText: "Staked - Waiting for Seller", color: "blue" };
      case TRADE_STATES.ACTIVE:
        return { status: "in_progress", displayText: "In Progress", color: "blue" };
      case TRADE_STATES.RELEASED:
        return { status: "released", displayText: "Item Released - Confirm Delivery", color: "green" };
      case TRADE_STATES.COMPLETED:
        return { status: "completed", displayText: "Completed", color: "green" };
      case TRADE_STATES.CANCELLED:
        return { status: "refunded", displayText: "Cancelled", color: "red" };
      default:
        return { status: "refunded", displayText: "Unknown", color: "gray" };
    }
  };

  const loadBuyerTrades = async () => {
    if (!contract || !userAddress) {
      console.log("Cannot load trades - contract:", !!contract, "userAddress:", userAddress);
      return;
    }
    
    setLoading(true);
    try {
      console.log("=== LOADING BUYER TRADES ===");
      console.log("Current user address:", userAddress);
      
      const tradeCount = await contract.tradeCounter();
      console.log("Total trades in contract:", tradeCount.toString());
      
      const buyerTradesList: Trade[] = [];
      
      for (let i = 1; i <= tradeCount; i++) {
        const rawTrade: RawTrade = await contract.trades(i);
        const tradeState = Number(rawTrade.state);
        
        console.log(`\n--- Trade #${i} ---`);
        console.log("Seller:", rawTrade.seller);
        console.log("Buyer:", rawTrade.buyer);
        console.log("User Address:", userAddress);
        console.log("Is Buyer?", rawTrade.buyer.toLowerCase() === userAddress.toLowerCase());
        
        // Only show trades where user is the buyer
        if (rawTrade.buyer.toLowerCase() !== userAddress.toLowerCase()) {
          console.log(`Trade #${i}: Not the buyer, skipping`);
          continue;
        }
        
        console.log(`✅ Trade #${i}: User is the buyer!`);
        console.log("Trade state:", tradeState);
        console.log("Price:", ethers.formatEther(rawTrade.price), "ETH");
        
        // Try to load metadata from localStorage
        const storedMetadata = localStorage.getItem(`listing_${i}`);
        let metadata = {
          title: `Trade #${i}`,
          description: "Listed item",
          category: "General",
          image: "",
        };
        
        if (storedMetadata) {
          try {
            const parsed = JSON.parse(storedMetadata);
            metadata = { ...metadata, ...parsed };
            console.log("Loaded metadata from localStorage:", metadata);
          } catch (e) {
            console.error("Error parsing metadata for trade", i, e);
          }
        }
        
        const { status, displayText } = getBuyerTradeStatus(tradeState);
        
        const trade: Trade = {
          tradeId: i.toString(),
          seller: rawTrade.seller,
          buyer: rawTrade.buyer,
          price: ethers.formatEther(rawTrade.price),
          category: metadata.category,
          status,
          title: metadata.title,
          description: metadata.description,
          image: metadata.image,
          contractState: tradeState,
          activationTime: rawTrade.activationTime,
        };
        
        buyerTradesList.push(trade);
        console.log(`Added trade #${i} to buyer trades list`);
      }
      
      console.log(`\n=== TOTAL BUYER TRADES FOUND: ${buyerTradesList.length} ===`);
      setTrades(buyerTradesList);
    } catch (error) {
      console.error("Error loading buyer trades:", error);
      showNotification("Failed to load your purchases. Please refresh the page.", "error");
    }
    setLoading(false);
  };

  const handleConfirmDelivery = async (trade: Trade) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      console.log("=== CONFIRMING DELIVERY ===");
      const tx = await contract.confirmDelivery(trade.tradeId);
      console.log("Transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("✅ Delivery confirmed");
      
      showNotification("Delivery confirmed successfully! Trade is now complete and your funds have been released.", "success");
      await loadBuyerTrades();
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      if (error.reason) {
        showNotification(`Failed to confirm delivery: ${error.reason}. Please try again.`, "error");
      } else {
        showNotification("Failed to confirm delivery. Please check your wallet and try again.", "error");
      }
    }
    setLoading(false);
  };

  const handleRefundTimeout = async (trade: Trade) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      console.log("=== REQUESTING TIMEOUT REFUND ===");
      const tx = await contract.refundTimeout(trade.tradeId);
      console.log("Transaction sent:", tx.hash);
      
      await tx.wait();
      console.log("✅ Refund processed");
      
      showNotification("Refund processed successfully. Your stake has been returned to your wallet.", "success");
      await loadBuyerTrades();
    } catch (error: any) {
      console.error("Error requesting refund:", error);
      if (error.reason) {
        showNotification(`Refund request failed: ${error.reason}`, "error");
      } else {
        showNotification("Refund not available yet. Please wait at least 5 minutes after the seller stakes.", "warning");
      }
    }
    setLoading(false);
  };

  const stats = {
    active: trades.filter(t => t.contractState !== TRADE_STATES.COMPLETED && t.contractState !== TRADE_STATES.CANCELLED).length,
    completed: trades.filter(t => t.contractState === TRADE_STATES.COMPLETED).length,
    totalSpent: trades.reduce((acc, t) => acc + parseFloat(t.price || "0"), 0).toFixed(2),
  };

  if (!userAddress) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to view your active stakes</p>
          <button
            onClick={initializeContract}
            className="px-6 py-3 bg-[#70ff00] text-black rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-4 sm:px-6 py-24 sm:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px]"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            My <span className="text-[#70ff00]">Active Stakes</span>
          </h1>
          <p className="text-gray-400">Track your purchases and confirm deliveries</p>
          
          {/* Refresh Button */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => loadBuyerTrades()}
              disabled={loading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Loading..." : "🔄 Refresh Stakes"}
            </button>
            <div className="text-gray-400 text-xs mt-2">
              Connected as: <span className="text-[#70ff00] font-mono">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm">Active Stakes</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.active}</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm">Completed</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.completed}</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-gray-400 text-sm">Total Spent</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalSpent} ETH</p>
          </div>
        </div>

        {/* Trades List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70ff00] mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading your stakes...</p>
            </div>
          ) : trades.length === 0 ? (
            <div className="space-y-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-12 backdrop-blur-sm text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No active stakes yet</h3>
                <p className="text-gray-400 mb-6">Visit the marketplace to purchase items</p>
                <a
                  href="/marketplace"
                  className="inline-block px-6 py-3 bg-[#70ff00] text-black rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Go to Marketplace
                </a>
              </div>
              
              {/* Debug Info */}
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-400 text-sm mb-2">💡 Debug Info:</p>
                <ul className="text-gray-400 text-xs space-y-1">
                  <li>✓ Connected Wallet: {userAddress.slice(0, 10)}...{userAddress.slice(-8)}</li>
                  <li>✓ No trades found where you are the buyer</li>
                  <li>💡 Make sure you're logged into the account that made the purchase</li>
                  <li>💡 Try clicking "Refresh Stakes" button above</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {trades.map((trade) => {
                const { displayText, color } = getBuyerTradeStatus(trade.contractState);
                const colorClasses = {
                  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                  green: "bg-green-500/10 border-green-500/20 text-green-400",
                  red: "bg-red-500/10 border-red-500/20 text-red-400",
                  gray: "bg-gray-500/10 border-gray-500/20 text-gray-400",
                };

                return (
                  <div key={trade.tradeId} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm hover:border-[#70ff00]/30 transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{trade.title}</h3>
                          <p className="text-gray-400 text-sm">{trade.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClasses[color as keyof typeof colorClasses]}`}>
                          {displayText}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-white/5">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Item Price</p>
                          <p className="text-white font-semibold">{trade.price} ETH</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Your Stake</p>
                          <p className="text-white font-semibold">{(parseFloat(trade.price) * 2).toFixed(3)} ETH</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Seller</p>
                          <p className="text-white font-mono text-xs">{trade.seller.slice(0, 6)}...{trade.seller.slice(-4)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Trade ID</p>
                          <p className="text-white font-semibold">#{trade.tradeId}</p>
                        </div>
                      </div>

                      {/* Action buttons based on state */}
                      {trade.contractState === TRADE_STATES.RELEASED && (
                        <div className="space-y-2">
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                            <p className="text-green-400 text-sm">
                              ✅ Item has been released by the seller. Please confirm delivery to complete the trade.
                            </p>
                          </div>
                          <button
                            onClick={() => handleConfirmDelivery(trade)}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-[#70ff00] text-black rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,255,0,0.4)] hover:scale-[1.02] disabled:opacity-50"
                          >
                            {loading ? "Confirming..." : "Confirm Delivery"}
                          </button>
                        </div>
                      )}

                      {trade.contractState === TRADE_STATES.ACTIVE && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <p className="text-blue-400 text-sm">
                            ⏳ Seller has staked. Waiting for item to be released...
                          </p>
                        </div>
                      )}

                      {trade.contractState === TRADE_STATES.BUYER_STAKED && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                          <p className="text-yellow-400 text-sm">
                            ⏳ Your stake confirmed. Waiting for seller to stake...
                          </p>
                        </div>
                      )}

                      {trade.contractState === TRADE_STATES.COMPLETED && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <p className="text-green-400 text-sm">
                            ✅ Trade completed! Your funds have been released.
                          </p>
                        </div>
                      )}

                      {trade.contractState === TRADE_STATES.CANCELLED && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-red-400 text-sm">
                            ❌ Trade cancelled. Your stake has been refunded.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

