"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, TRADE_STATES } from "../utils/constants";
import { useNotification } from "../contexts/NotificationContext";

interface Listing {
  tradeId: string;
  title: string;
  description: string;
  price: string;
  category: string;
  seller: string;
  createdAt: string;
  contractState: number;
}

interface Trade {
  tradeId: number;
  seller: string;
  buyer: string;
  price: number;
  sellerStake: number;
  buyerStake: number;
  activationTime: number;
  state: number;
}

export default function Marketplace() {
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");

  // Initialize contract
  useEffect(() => {
    initializeContract();
  }, []);

  // Load marketplace listings when contract is ready
  useEffect(() => {
    if (contract) {
      loadMarketplaceListings();
      // Refresh every 30 seconds
      const interval = setInterval(loadMarketplaceListings, 30000);
      return () => clearInterval(interval);
    }
  }, [contract]);

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
            console.log("✓ Ethereum provider initialized (Marketplace)");
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
      
      // Try to get signer for write operations, fallback to provider for read-only
      let contractInstance;
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setUserAddress(accounts[0]);
        console.log("✓ Connected with signer for write operations");
      } catch (error: any) {
        // User rejected connection or ngrok/CORS issue, use read-only
        console.log("Using read-only mode:", error.message);
        contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      }
      
      setContract(contractInstance);
      console.log("✓ Contract initialized (Marketplace)");
    } catch (error: any) {
      console.error("Error initializing contract:", error);
      if (error.message?.includes("could not coalesce")) {
        console.error("Cross-origin provider issue detected. Retrying...");
        setTimeout(initializeContract, 2000);
      }
    }
  };

  const loadMarketplaceListings = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tradeCount = await contract.tradeCounter();
      const marketplaceListings: Listing[] = [];
      
      for (let i = 1; i <= tradeCount; i++) {
        const trade: Trade = await contract.trades(i);
        const tradeState = Number(trade.state);
        
        // Only show listings that are in "Created" state (available for purchase)
        if (tradeState === TRADE_STATES.CREATED) {
          // Fetch metadata from contract
          let metadata = {
            title: `Trade #${i}`,
            description: `Listed item for trade`,
            category: "General",
            image: ""
          };
          
          try {
            const contractMetadata = await contract.getMetadata(i);
            metadata = {
              title: contractMetadata.itemName || `Trade #${i}`,
              description: contractMetadata.itemDescription || `Listed item for trade`,
              category: contractMetadata.category || "General",
              image: ""
            };
          } catch (e) {
            console.error("Error fetching metadata for trade", i, e);
          }
          
          const listing: Listing = {
            tradeId: i.toString(),
            title: metadata.title,
            description: metadata.description,
            price: ethers.formatEther(trade.price.toString()),
            category: metadata.category,
            seller: trade.seller,
            createdAt: new Date().toISOString().split("T")[0],
            contractState: tradeState
          };
          
          marketplaceListings.push(listing);
        }
      }
      
      setListings(marketplaceListings);
    } catch (error) {
      console.error("Error loading marketplace listings:", error);
    }
    setLoading(false);
  };

  const handleBuyerDeposit = async (listing: Listing) => {
    if (!contract || !userAddress) {
      showNotification("Please connect your wallet to continue", "warning");
      await initializeContract();
      return;
    }

    setLoading(true);
    
    // Retry logic for network congestion
    const sendTransactionWithRetry = async (maxRetries = 3) => {
      const priceInWei = ethers.parseEther(listing.price);
      const stakeAmount = priceInWei * BigInt(2); // Buyer stakes 2x the price
      
      console.log("=== BUYER DEPOSIT TRANSACTION ===");
      console.log("Trade ID:", listing.tradeId);
      console.log("Price in Wei:", priceInWei.toString());
      console.log("Stake amount (2x):", stakeAmount.toString());
      console.log("Stake amount in ETH:", ethers.formatEther(stakeAmount));
      
      // Check user balance
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const balance = await provider.getBalance(userAddress);
      const totalBalance = balance + BigInt(0);
      console.log("Your balance:", ethers.formatEther(totalBalance), "ETH");
      
      // Add buffer for gas fees
      const gasBuffer = ethers.parseEther("0.02"); // Increased buffer for retries
      const requiredAmount = stakeAmount + gasBuffer;
      
      if (totalBalance < requiredAmount) {
        throw new Error(`INSUFFICIENT_BALANCE: You need ${ethers.formatEther(stakeAmount)} ETH for stake + ${ethers.formatEther(gasBuffer)} ETH for gas. You have ${ethers.formatEther(totalBalance)} ETH`);
      }
      
      let gasLimit = BigInt(100000);
      try {
        console.log("Attempting gas estimation...");
        const estimatedGas = await contract.buyerDeposit.estimateGas(listing.tradeId, {
          value: stakeAmount
        });
        gasLimit = estimatedGas + BigInt(30000); // 30% buffer
        console.log("Estimated gas:", estimatedGas.toString(), "Gas limit:", gasLimit.toString());
      } catch (gasError: any) {
        console.warn("Gas estimation failed, using default:", gasError.message);
      }
      
      // Retry loop
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`\n📤 Attempt ${attempt}/${maxRetries} - Sending transaction...`);
          const tx = await contract.buyerDeposit(listing.tradeId, {
            value: stakeAmount,
            gasLimit: gasLimit
          });
          
          console.log("✅ Transaction sent:", tx.hash);
          console.log("Waiting for confirmation...");
          
          const receipt = await tx.wait();
          console.log("✅ Transaction confirmed in block:", receipt?.blockNumber);
          
          return { success: true, receipt };
        } catch (error: any) {
          const isNetworkError = error.code === -32002 || error.message?.includes("too many errors") || error.message?.includes("network");
          const isLastAttempt = attempt === maxRetries;
          
          if (isNetworkError && !isLastAttempt) {
            const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
            console.warn(`⚠️ Network busy (attempt ${attempt}). Retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue; // Retry
          }
          
          throw error; // Not a network error or last attempt, throw it
        }
      }
    };
    
    try {
      const result = await sendTransactionWithRetry(3);
      
      if (result && result.success) {
        showNotification("Purchase successful! Waiting for seller to confirm and ship your item.", "success");
        await loadMarketplaceListings();
        setSelectedListing(null);
      }
      
      
    } catch (error: any) {
      console.error("=== TRANSACTION ERROR ===", error);
      
      // User cancelled transaction
      if (error.code === 4001 || error.message?.includes("user rejected")) {
        showNotification("Transaction cancelled. No funds were deducted.", "warning");
      } 
      // Insufficient balance for the stake
      else if (error.message?.includes("INSUFFICIENT_BALANCE")) {
        showNotification("Insufficient balance. You need enough ETH to cover the 2x stake amount.", "error");
      } 
      // Not enough ETH for gas fees
      else if (error.message?.includes("insufficient funds")) {
        showNotification("Not enough ETH to pay for transaction fees. Please add more ETH to your wallet.", "error");
      } 
      // RPC/Network errors
      else if (error.code === -32603 || error.code === -32002 || error.message?.includes("Internal error") || error.message?.includes("too many errors")) {
        showNotification("Network connection issue. Please check your internet and try again.", "error");
      }
      // Contract revert with reason
      else if (error.reason) {
        const humanReason = error.reason
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (l: string) => l.toUpperCase());
        showNotification(`Transaction failed: ${humanReason}`, "error");
      } 
      // Generic error
      else {
        showNotification("Transaction failed. Please try again or contact support if the issue persists.", "error");
      }
    }
    setLoading(false);
  };

  const categories = ["all", "Electronics", "Fashion", "Home", "Sports", "Books", "Collectibles", "Other"];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuy = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const closeBuyModal = () => {
    setSelectedListing(null);
  };

  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70ff00] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-4 sm:px-6 py-24 sm:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px]"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            <span className="text-[#70ff00]">Marketplace</span>
          </h1>
          <p className="text-gray-400">Discover and trade items securely with dual-stake escrow</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-6 backdrop-blur-sm mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#70ff00] transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#70ff00] transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span className="text-gray-400">
              <span className="text-white font-semibold">{filteredListings.length}</span> listings found
            </span>
            <span className="text-gray-400">
              Total Volume: <span className="text-[#70ff00] font-semibold">
                {listings.reduce((acc, l) => acc + parseFloat(l.price), 0).toFixed(2)} ETH
              </span>
            </span>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#70ff00] mx-auto mb-4"></div>
            <p className="text-gray-400">Updating listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-12 backdrop-blur-sm text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No listings found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filters" 
                : "No active listings available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.tradeId} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm hover:border-[#70ff00]/30 transition-all duration-300 group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#70ff00]/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-semibold text-[#70ff00]">
                      {listing.category}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{listing.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Price</p>
                      <p className="text-[#70ff00] font-bold text-2xl">{listing.price} ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs mb-1">Your Stake</p>
                      <p className="text-white font-semibold">{(parseFloat(listing.price) * 2).toFixed(3)} ETH</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#70ff00]/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#70ff00]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-xs font-mono">{listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</span>
                  </div>

                  <button
                    onClick={() => handleBuy(listing)}
                    className="w-full px-4 py-3 bg-[#70ff00] text-black rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,255,0,0.4)] hover:scale-[1.02]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 md:p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Confirm Purchase</h2>
                <button
                  onClick={closeBuyModal}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Listing Details */}
              <div className="w-full h-48 overflow-hidden rounded-xl mb-6 bg-gradient-to-br from-[#70ff00]/10 to-purple-500/10 flex items-center justify-center">
                <svg className="w-20 h-20 text-[#70ff00]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{selectedListing.title}</h3>
              <p className="text-gray-400 mb-6">{selectedListing.description}</p>

              {/* Payment Breakdown */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Payment Breakdown</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Item Price</span>
                    <span className="text-white font-semibold">{selectedListing.price} ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Your Stake (2x)</span>
                    <span className="text-white font-semibold">{(parseFloat(selectedListing.price) * 2).toFixed(3)} ETH</span>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">Total to Pay</span>
                      <span className="text-[#70ff00] font-bold text-2xl">{(parseFloat(selectedListing.price) * 2).toFixed(3)} ETH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-400 font-semibold text-sm">How it works</p>
                    <p className="text-gray-300 text-sm mt-1">
                      You stake 2x the price. The seller will stake 1.5x. Once the seller ships and you confirm receipt, you get your stake back and pay only the item price.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={closeBuyModal}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleBuyerDeposit(selectedListing);
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#70ff00] text-black rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,255,0,0.4)] hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
