"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create } from '@storacha/client';
import { CONTRACT_ADDRESS, CONTRACT_ABI, TRADE_STATES, IPFS_GATEWAYS } from "../utils/constants";
import { useNotification } from "../contexts/NotificationContext";

interface Listing {
  tradeId: string;
  title: string;
  description: string;
  price: string;
  category: string;
  status: "active" | "sold" | "cancelled" | "in_progress" | "can_relist";
  createdAt: string;
  image?: string;
  ipfsHash?: string;
  metadataHash?: string;
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

export default function Listings() {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "myListings" | "pendingActions">("dashboard");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [storageClient, setStorageClient] = useState<any>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  // Initialize contract and IPFS client
  useEffect(() => {
    initializeContract();
    initializeStoracha();
  }, []);

  // Load user's listings when contract is ready
  useEffect(() => {
    if (contract && userAddress) {
      loadUserListings();
      checkForNotifications();
      
      // Auto-refresh every 30 seconds to keep data current
      const intervalId = setInterval(() => {
        loadUserListings();
        checkForNotifications();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [contract, userAddress]);

  const initializeContract = async () => {
    try {
      if (typeof window === 'undefined') {
        showNotification("This feature requires a web browser. Please use a desktop or mobile browser.", "error");
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
            break;
          } catch (err) {
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }

      if (!provider) {
        showNotification("MetaMask wallet not found. Please install MetaMask browser extension to continue.", "warning");
        return;
      }

      const accounts = await provider.send("eth_requestAccounts", []);
      
      const userSigner = await provider.getSigner();
      
      if (!CONTRACT_ADDRESS) {
        showNotification("Unable to connect to smart contract. Please check configuration.", "error");
        return;
      }
      
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, userSigner);
      
      // Test contract connection with retry
      let tradeCounter: any = null;
      for (let i = 0; i < 3; i++) {
        try {
          tradeCounter = await contractInstance.tradeCounter();
          break;
        } catch (testError: any) {
          if (i < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            throw new Error(`Failed to connect to contract after 3 attempts: ${testError.message}`);
          }
        }
      }
      
      setContract(contractInstance);
      setSigner(userSigner);
      setUserAddress(accounts[0]);
      
    } catch (error: any) {
      console.error("Error initializing contract:", error);
      
      if (error.code === 4001) {
        showNotification("Please connect your wallet to continue", "warning");
      } else if (error.code === "NETWORK_ERROR" || error.message?.includes("network")) {
        showNotification("Network connection issue. Please check your internet and try again.", "error");
      } else if (error.message?.includes("could not coalesce")) {
        showNotification("Connection problem detected. Please refresh the page.", "error");
      } else if (error.message?.includes("Failed to connect to contract")) {
        showNotification(error.message || "An unexpected error occurred", "error");
      } else {
        showNotification(error.message || "An unexpected error occurred. Please try again.", "error");
      }
    }
  };

  const initializeStoracha = async () => {
    try {
      const client = create();
      setStorageClient(client);
    } catch (error) {
      console.error("Error initializing Storacha:", error);
    }
  };

  const uploadToIPFS = async (file: File): Promise<string | null> => {
    if (!storageClient) {
      return null;
    }
    
    try {
      const cid = await storageClient.uploadFile(file);
      return cid.toString();
    } catch (error) {
      return null;
    }
  };

  const deleteFromIPFS = async (ipfsHash: string): Promise<boolean> => {
    if (!storageClient) return false;
    
    try {
      await storageClient.remove(ipfsHash);
      return true;
    } catch (error) {
      console.error("Error deleting from IPFS:", error);
      return false;
    }
  };

  const getTradeState = (state: number): { status: Listing['status'], displayText: string } => {
    switch (state) {
      case TRADE_STATES.CREATED: return { status: "active", displayText: "Active" };
      case TRADE_STATES.BUYER_STAKED: return { status: "in_progress", displayText: "Buyer Staked" };
      case TRADE_STATES.ACTIVE: return { status: "in_progress", displayText: "In Progress" };
      case TRADE_STATES.RELEASED: return { status: "in_progress", displayText: "Released" };
      case TRADE_STATES.COMPLETED: return { status: "sold", displayText: "Completed" };
      case TRADE_STATES.CANCELLED: return { status: "can_relist", displayText: "Can Relist" };
      default: return { status: "cancelled", displayText: "Cancelled" };
    }
  };

  const loadMetadataFromIPFS = async (metadataHash: string): Promise<any> => {
    if (!storageClient) return null;
    
    try {
      const response = await fetch(`${IPFS_GATEWAYS[0]}${metadataHash}`);
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      return null;
    }
  };

  const checkForNotifications = async () => {
    if (!contract || !userAddress) return;
    
    try {
      const tradeCount = await contract.tradeCounter();
      const newNotifications: string[] = [];
      
      for (let i = 1; i <= tradeCount; i++) {
        const trade: Trade = await contract.trades(i);
        const tradeState = Number(trade.state);
        
        // Notify seller when buyer has staked
        if (trade.seller.toLowerCase() === userAddress.toLowerCase() && tradeState === TRADE_STATES.BUYER_STAKED) {
          newNotifications.push(`Trade #${i}: Buyer has staked! Please deposit your stake to activate the trade.`);
        }
        
        // Notify buyer when seller has staked
        if (trade.buyer.toLowerCase() === userAddress.toLowerCase() && tradeState === TRADE_STATES.ACTIVE) {
          newNotifications.push(`Trade #${i}: Seller has staked! Waiting for seller to release item...`);
        }
        
        // Notify buyer when item is released
        if (trade.buyer.toLowerCase() === userAddress.toLowerCase() && tradeState === TRADE_STATES.RELEASED) {
          newNotifications.push(`Trade #${i}: Item has been released! Please confirm delivery.`);
        }
      }
      
      setNotifications(newNotifications);
    } catch (error) {
      console.error("Error checking notifications:", error);
    }
  };

  const loadUserListings = async () => {
    if (!contract || !userAddress) return;
    
    setLoading(true);
    try {
      const tradeCount = await contract.tradeCounter();
      const userListings: Listing[] = [];
      
      for (let i = 1; i <= tradeCount; i++) {
        const trade: Trade = await contract.trades(i);
        
        if (trade.seller.toLowerCase() === userAddress.toLowerCase()) {
          const tradeState = Number(trade.state);
          const { status, displayText } = getTradeState(tradeState);
          
          // Handle completed trades - auto delete and remove from IPFS
          if (tradeState === TRADE_STATES.COMPLETED) {
            // This could be handled with a separate cleanup function
            // For now, we'll skip showing completed trades
            continue;
          }
          
          // Try to load metadata from localStorage
          const storedMetadata = localStorage.getItem(`listing_${i}`);
          let metadata = {
            title: `Trade #${i}`,
            description: `Listed item for trade`,
            category: "General",
            image: "",
            metadataHash: ""
          };
          
          if (storedMetadata) {
            try {
              const parsed = JSON.parse(storedMetadata);
              metadata = { ...metadata, ...parsed };
            } catch (e) {
              // Error parsing metadata, continue with defaults
            }
          }
          
          const listing: Listing = {
            tradeId: i.toString(),
            title: metadata.title,
            description: metadata.description,
            price: ethers.formatEther(trade.price.toString()),
            category: metadata.category,
            status,
            createdAt: new Date().toISOString().split("T")[0],
            image: metadata.image,
            metadataHash: metadata.metadataHash,
            contractState: tradeState
          };
          
          userListings.push(listing);
        }
      }
      
      setListings(userListings);
    } catch (error) {
      console.error("Error loading listings:", error);
    }
    setLoading(false);
  };

  const handleDeleteCompletedTrade = async (listing: Listing) => {
    if (listing.contractState !== TRADE_STATES.COMPLETED) return;
    
    try {
      // Delete image from IPFS if exists
      if (listing.ipfsHash) {
        await deleteFromIPFS(listing.ipfsHash);
      }
      
      // Delete metadata from IPFS if exists
      if (listing.metadataHash) {
        await deleteFromIPFS(listing.metadataHash);
      }
      
      // Remove from local state
      setListings(listings.filter(l => l.tradeId !== listing.tradeId));
    } catch (error) {
      console.error("Error deleting completed trade:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to retry transactions with exponential backoff
  const sendTransactionWithRetry = async (txFn: () => Promise<any>, maxRetries = 5) => {
    let lastError: any = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const tx = await txFn();
        return tx;
      } catch (error: any) {
        lastError = error;
        
        // Check for RPC overload errors
        if (error.code === -32002 || error.message?.includes("too many errors")) {
          const waitTime = Math.pow(2, attempt + 1) * 1000; // Exponential backoff: 2s, 4s, 8s, 16s, 32s
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        // For other errors, throw immediately
        throw error;
      }
    }
    
    throw new Error(`Transaction failed after ${maxRetries} attempts: ${lastError.message}`);
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contract || !signer) {
      showNotification("Please connect your wallet to create listings", "warning");
      return;
    }

    setLoading(true);
    try {
      // Convert price to wei
      const priceInWei = ethers.parseEther(formData.price);
      
      // Estimate gas first to catch any contract errors
      try {
        const gasEstimate = await contract.createListing.estimateGas(priceInWei);
      } catch (gasError: any) {
        throw new Error(`Transaction will fail: ${gasError.reason || gasError.message}`);
      }

      // Create listing on blockchain with retry
      const tx = await sendTransactionWithRetry(() => 
        contract.createListing(priceInWei)
      );
      
      const receipt = await tx.wait();
      
      // Wait for transaction to be mined
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      // Get the new trade ID from the contract
      const newTradeId = await contract.tradeCounter();
      
      // Store metadata in localStorage for persistence
      const metadata = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image: formData.image,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(`listing_${newTradeId}`, JSON.stringify(metadata));

      // Reload listings first
      await loadUserListings();
      
      // Then show success notification
      showNotification("Listing created successfully! Buyers can now purchase your item.", "success");

      // Reset form
      setFormData({ title: "", description: "", price: "", category: "", image: "" });
      setImagePreview("");
      setActiveTab("myListings");
      
    } catch (error: any) {
      
      // Check if user rejected
      if (error.code === 4001 || error.code === "ACTION_REJECTED") {
        showNotification("Transaction cancelled. No changes were made.", "warning");
      } 
      // Check if error message indicates user rejection
      else if (error.message && (
        error.message.includes("user rejected") || 
        error.message.includes("User denied") ||
        error.message.includes("rejected the request")
      )) {
        showNotification("Transaction cancelled. No changes were made.", "warning");
      }
      // Transaction will fail (from gas estimation)
      else if (error.message && error.message.includes("Transaction will fail")) {
        showNotification(error.message || "An unexpected error occurred", "error");
      }
      // Contract revert
      else if (error.reason) {
        showNotification(`Transaction failed: ${error.reason}`, "error");
      }
      // Network or RPC error  
      else if (error.code === "NETWORK_ERROR" || error.code === -32603) {
        showNotification("Network connection issue. Please check your internet and try again.", "error");
      }
      // Insufficient funds
      else if (error.code === "INSUFFICIENT_FUNDS") {
        showNotification("Not enough ETH for transaction fees. Please add more ETH to your wallet.", "error");
      }
      // Generic error
      else {
        showNotification(error.message || "An unexpected error occurred. Please try again.", "error");
      }
    }
    setLoading(false);
  };

  const handleCancelListing = async (tradeId: string) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      // Note: You might need to implement a cancel function in your contract
      // or handle this through the emergencyWithdrawBuyer function
      await loadUserListings(); // Refresh listings
    } catch (error) {
      console.error("Error cancelling listing:", error);
    }
    setLoading(false);
  };

  const handleReList = async (listing: Listing) => {
    if (!contract || listing.contractState !== TRADE_STATES.CANCELLED) return;
    
    setLoading(true);
    try {
      const priceInWei = ethers.parseEther(listing.price);
      const tx = await sendTransactionWithRetry(() =>
        contract.createListing(priceInWei)
      );
      await tx.wait();
      
      await loadUserListings();
    } catch (error: any) {
      console.error("Error re-listing:", error);
      if (error.code === -32002 || error.message?.includes("too many errors")) {
        showNotification("Network is busy. Please wait a moment and try again.", "error");
      } else {
        showNotification("Failed to re-list item. Please try again.", "error");
      }
    }
    setLoading(false);
  };

  const handleSellerDeposit = async (listing: Listing) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const priceInWei = ethers.parseEther(listing.price);
      const stakeAmount = (priceInWei * BigInt(3)) / BigInt(2); // Seller stakes 1.5x
      
      const tx = await sendTransactionWithRetry(() =>
        contract.sellerDeposit(listing.tradeId, {
          value: stakeAmount
        })
      );
      
      await tx.wait();
      
      showNotification("Successfully staked! Trade is now active. Please release the item within 5 minutes.", "success");
      await loadUserListings();
      await checkForNotifications();
    } catch (error: any) {
      console.error("Error staking as seller:", error);
      if (error.code === 4001) {
        showNotification("Transaction cancelled. No changes were made.", "warning");
      } else if (error.code === -32002 || error.message?.includes("too many errors")) {
        showNotification("Network is busy. Please wait a moment and try again.", "error");
      } else if (error.reason) {
        showNotification(`Operation failed: ${error.reason}`, "error");
      } else {
        showNotification(`Failed to stake. Please try again.`, "error");
      }
    }
    setLoading(false);
  };

  const handleReleaseItem = async (listing: Listing) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await sendTransactionWithRetry(() =>
        contract.markItemReleased(listing.tradeId)
      );
      
      await tx.wait();
      
      showNotification("Item released! Waiting for buyer to confirm delivery.", "success");
      await loadUserListings();
      await checkForNotifications();
    } catch (error: any) {
      console.error("Error releasing item:", error);
      if (error.code === -32002 || error.message?.includes("too many errors")) {
        showNotification("Network is busy. Please wait a moment and try again.", "error");
      } else if (error.reason) {
        showNotification(`Operation failed: ${error.reason}`, "error");
      } else {
        showNotification(`Failed to release item. Please try again.`, "error");
      }
    }
    setLoading(false);
  };

  const handleConfirmDelivery = async (listing: Listing) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await sendTransactionWithRetry(() =>
        contract.confirmDelivery(listing.tradeId)
      );
      
      await tx.wait();
      
      showNotification("Delivery confirmed! Trade completed successfully.", "success");
      await loadUserListings();
      await checkForNotifications();
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      if (error.code === -32002 || error.message?.includes("too many errors")) {
        showNotification("Network is busy. Please wait a moment and try again.", "error");
      } else if (error.reason) {
        showNotification(`Operation failed: ${error.reason}`, "error");
      } else {
        showNotification(`Failed to confirm delivery. Please try again.`, "error");
      }
    }
    setLoading(false);
  };

  const handleRefundTimeout = async (listing: Listing) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await sendTransactionWithRetry(() =>
        contract.refundTimeout(listing.tradeId)
      );
      
      await tx.wait();
      
      showNotification("Refund processed successfully due to timeout.", "success");
      await loadUserListings();
      await checkForNotifications();
    } catch (error: any) {
      console.error("Error requesting refund:", error);
      if (error.code === -32002 || error.message?.includes("too many errors")) {
        showNotification("Network is busy. Please wait a moment and try again.", "error");
      } else if (error.reason) {
        showNotification(`Operation failed: ${error.reason}`, "error");
      } else {
        showNotification(`Failed to process refund. Please try again.`, "error");
      }
    }
    setLoading(false);
  };

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === "active").length,
    sold: listings.filter(l => l.status === "sold").length,
    totalVolume: listings.reduce((acc, l) => acc + parseFloat(l.price || "0"), 0).toFixed(2),
  };

  // Auto-refresh listings every 30 seconds to check for state changes
  useEffect(() => {
    if (contract && userAddress) {
      const interval = setInterval(() => {
        loadUserListings();
        checkForNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [contract, userAddress]);

  if (!userAddress) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to view and manage listings</p>
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px]"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
            My <span className="text-[#70ff00]">Listings</span>
          </h1>
          <p className="text-gray-400">Manage your listings and track your trading activity</p>
          
          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="mt-4 space-y-2">
              {notifications.map((notification, index) => (
                <div key={index} className="bg-[#70ff00]/10 border border-[#70ff00]/30 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#70ff00] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-[#70ff00] text-sm">{notification}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
              activeTab === "dashboard"
                ? "bg-[#70ff00] text-black"
                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === "create"
                ? "bg-[#70ff00] text-black"
                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            Create Listing
          </button>
          <button
            onClick={() => setActiveTab("myListings")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === "myListings"
                ? "bg-[#70ff00] text-black"
                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            My Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab("pendingActions")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === "pendingActions"
                ? "bg-[#70ff00] text-black"
                : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            Pending Actions
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-400 text-sm">Total Listings</h3>
                </div>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#70ff00]/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-400 text-sm">Active</h3>
                </div>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-gray-400 text-sm">Sold</h3>
                </div>
                <p className="text-3xl font-bold text-white">{stats.sold}</p>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-400 text-sm">Total Volume</h3>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalVolume} ETH</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {listings.slice(0, 5).map((listing) => (
                  <div key={listing.tradeId} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${listing.status === "active" ? "bg-[#70ff00]" : listing.status === "sold" ? "bg-blue-400" : "bg-gray-500"}`}></div>
                      <div>
                        <p className="text-white font-semibold">{listing.title}</p>
                        <p className="text-gray-400 text-sm">{listing.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{listing.price} ETH</p>
                      <p className="text-gray-400 text-sm capitalize">{listing.status}</p>
                    </div>
                  </div>
                ))}
                {listings.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No listings yet. Create your first listing!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pending Actions Tab */}
        {activeTab === "pendingActions" && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70ff00] mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading pending actions...</p>
              </div>
            ) : listings.filter(l => l.status === "in_progress").length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-12 backdrop-blur-sm text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No pending actions</h3>
                <p className="text-gray-400">All your listings are either active or completed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.filter(l => l.status === "in_progress").map((listing) => (
                  <div key={listing.tradeId} className="bg-gradient-to-br from-orange-500/5 to-orange-500/[0.02] border-2 border-orange-500/30 rounded-xl overflow-hidden backdrop-blur-sm">
                    {listing.image && (
                      <div className="w-full h-48 overflow-hidden bg-black/50 relative">
                        <img 
                          src={listing.image.startsWith('ipfs://') 
                            ? IPFS_GATEWAYS[0] + listing.image.slice(7) 
                            : listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                          ACTION REQUIRED
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
                      
                      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
                        <p className="text-orange-400 font-semibold text-sm mb-2">🔔 Buyer has staked!</p>
                        <p className="text-gray-300 text-xs">You need to stake 1.5x ({(parseFloat(listing.price) * 1.5).toFixed(3)} ETH) to activate this trade.</p>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Price</p>
                          <p className="text-[#70ff00] font-bold text-lg">{listing.price} ETH</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs mb-1">Your Stake Needed</p>
                          <p className="text-orange-400 font-semibold">{(parseFloat(listing.price) * 1.5).toFixed(3)} ETH</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSellerDeposit(listing)}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                      >
                        {loading ? "Processing..." : "Stake & Activate Trade"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Listing Tab */}
        {activeTab === "create" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-6 md:p-8 backdrop-blur-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Create New Listing</h2>
              
              <form onSubmit={handleCreateListing} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Item Image</label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-[#70ff00]/50 transition-colors bg-black/50"
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-400 text-sm">Click to upload image</p>
                          <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                    </label>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormData({ ...formData, image: "" });
                        }}
                        className="text-red-400 text-sm hover:text-red-300 transition-colors"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Item Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Gaming Laptop RTX 4070"
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#70ff00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of your item..."
                    rows={4}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#70ff00] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Price (ETH)</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.5"
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#70ff00] transition-colors"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    Buyer will stake: {formData.price ? (parseFloat(formData.price) * 2).toFixed(3) : "0"} ETH • 
                    Seller will stake: {formData.price ? (parseFloat(formData.price) * 1.5).toFixed(3) : "0"} ETH
                  </p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#70ff00] transition-colors"
                  >
                    <option value="">Select a category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Sports">Sports & Outdoors</option>
                    <option value="Books">Books & Media</option>
                    <option value="Collectibles">Collectibles</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-yellow-400 font-semibold text-sm">Important</p>
                      <p className="text-gray-300 text-sm mt-1">
                        Once a buyer stakes and you confirm, you'll need to stake 1.5x the price. Make sure you have sufficient funds.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-[#70ff00] text-black rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,255,0,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Listing..." : "Create Listing"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === "myListings" && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70ff00] mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading your listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-12 backdrop-blur-sm text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No listings yet</h3>
                <p className="text-gray-400 mb-6">Create your first listing to start trading</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-6 py-3 bg-[#70ff00] text-black rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Create Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <div key={listing.tradeId} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm hover:border-[#70ff00]/30 transition-all duration-300">
                    {listing.image && (
                      <div className="w-full h-48 overflow-hidden bg-black/50">
                        <img 
                          src={listing.image.startsWith('ipfs://') ? `${IPFS_GATEWAYS[0]}${listing.image.slice(7)}` : listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Try fallback IPFS gateways if first one fails
                            const img = e.target as HTMLImageElement;
                            if (listing.image?.startsWith('ipfs://')) {
                              const hash = listing.image.slice(7);
                              const currentGateway = img.src.split('/ipfs/')[0] + '/ipfs/';
                              const currentIndex = IPFS_GATEWAYS.indexOf(currentGateway);
                              if (currentIndex < IPFS_GATEWAYS.length - 1) {
                                img.src = `${IPFS_GATEWAYS[currentIndex + 1]}${hash}`;
                              }
                            }
                          }}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          listing.status === "active" 
                            ? "bg-[#70ff00]/20 text-[#70ff00]" 
                            : listing.status === "sold"
                            ? "bg-blue-500/20 text-blue-400"
                            : listing.status === "in_progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : listing.status === "can_relist"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {getTradeState(listing.contractState).displayText}
                        </span>
                        <span className="text-gray-400 text-xs">Trade #{listing.tradeId}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">{listing.category}</span>
                        <span className="text-[#70ff00] font-bold text-lg">{listing.price} ETH</span>
                      </div>

                      {/* Action buttons based on trade state */}
                      {/* State 0: Created - Waiting for buyer */}
                      {listing.contractState === TRADE_STATES.CREATED && (
                        <div className="w-full px-4 py-2 bg-[#70ff00]/10 border border-[#70ff00]/20 text-[#70ff00] rounded-lg font-semibold text-sm text-center">
                          Waiting for Buyer
                        </div>
                      )}
                      
                      {/* State 1: Buyer Staked - Seller needs to stake */}
                      {listing.contractState === TRADE_STATES.BUYER_STAKED && (
                        <button
                          onClick={() => handleSellerDeposit(listing)}
                          disabled={loading}
                          className="w-full px-4 py-2 bg-[#70ff00] text-black rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-[#70ff00]/80 disabled:opacity-50"
                        >
                          Stake {(parseFloat(listing.price) * 1.5).toFixed(3)} ETH to Activate
                        </button>
                      )}
                      
                      {/* State 2: Active - Seller needs to release item */}
                      {listing.contractState === TRADE_STATES.ACTIVE && (
                        <div className="space-y-2">
                          <button
                            onClick={() => handleReleaseItem(listing)}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-[#70ff00] text-black rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-[#70ff00]/80 disabled:opacity-50"
                          >
                            Release Item
                          </button>
                          <p className="text-gray-400 text-xs text-center">Release within 5 minutes or buyer can request refund</p>
                        </div>
                      )}
                      
                      {/* State 3: Released - Waiting for buyer confirmation */}
                      {listing.contractState === TRADE_STATES.RELEASED && (
                        <div className="w-full px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg font-semibold text-sm text-center">
                          Item Released - Waiting for Buyer Confirmation
                        </div>
                      )}
                      
                      {/* State 5: Cancelled - Can relist */}
                      {listing.contractState === TRADE_STATES.CANCELLED && (
                        <button
                          onClick={() => handleReList(listing)}
                          disabled={loading}
                          className="w-full px-4 py-2 bg-[#70ff00]/10 border border-[#70ff00]/20 text-[#70ff00] rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-[#70ff00]/20 disabled:opacity-50"
                        >
                          Re-list Item
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Actions Tab - Items where buyer has staked */}
        {activeTab === "pendingActions" && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70ff00] mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading pending actions...</p>
              </div>
            ) : listings.filter(l => l.contractState === TRADE_STATES.BUYER_STAKED || l.contractState === TRADE_STATES.ACTIVE).length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-12 backdrop-blur-sm text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No pending actions</h3>
                <p className="text-gray-400">Items requiring your attention will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.filter(l => l.contractState === TRADE_STATES.BUYER_STAKED || l.contractState === TRADE_STATES.ACTIVE).map((listing) => (
                  <div key={listing.tradeId} className="bg-gradient-to-br from-orange-500/10 to-orange-500/[0.02] border-2 border-orange-500/40 rounded-xl overflow-hidden backdrop-blur-sm">
                    {listing.image && (
                      <div className="w-full h-48 overflow-hidden bg-black/50 relative">
                        <img 
                          src={listing.image.startsWith('ipfs://') ? `${IPFS_GATEWAYS[0]}${listing.image.slice(7)}` : listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                          🔔 ACTION REQUIRED
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
                      
                      {listing.contractState === TRADE_STATES.BUYER_STAKED && (
                        <>
                          <div className="bg-orange-500/20 border border-orange-500/40 rounded-lg p-4 mb-4">
                            <p className="text-orange-400 font-semibold text-sm mb-2">💰 Buyer Has Staked!</p>
                            <p className="text-gray-300 text-xs">Stake 1.5x to activate this trade and ship the item.</p>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                            <div>
                              <p className="text-gray-400 text-xs mb-1">Price</p>
                              <p className="text-[#70ff00] font-bold text-lg">{listing.price} ETH</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-xs mb-1">Stake Needed</p>
                              <p className="text-orange-400 font-semibold">{(parseFloat(listing.price) * 1.5).toFixed(3)} ETH</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleSellerDeposit(listing)}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                          >
                            {loading ? "Processing..." : "Stake & Activate"}
                          </button>
                        </>
                      )}

                      {listing.contractState === TRADE_STATES.ACTIVE && (
                        <>
                          <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 mb-4">
                            <p className="text-blue-400 font-semibold text-sm mb-2">📦 Release Item</p>
                            <p className="text-gray-300 text-xs">Both parties have staked. Release the item within 5 minutes.</p>
                          </div>
                          
                          <button
                            onClick={() => handleReleaseItem(listing)}
                            disabled={loading}
                            className="w-full px-4 py-3 bg-[#70ff00] text-black rounded-lg font-semibold transition-all duration-300 hover:bg-[#70ff00]/80 disabled:opacity-50"
                          >
                            {loading ? "Processing..." : "Release Item"}
                          </button>
                          <p className="text-red-400 text-xs text-center mt-2">⚠️ Buyer can request refund after 5 minutes</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


