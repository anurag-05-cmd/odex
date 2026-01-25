"use client";

import { useState } from "react";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  seller: string;
  createdAt: string;
  image?: string;
}

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Mock listings data
  const [listings] = useState<Listing[]>([
    {
      id: "1",
      title: "Gaming Laptop",
      description: "High-performance gaming laptop with RTX 4070, 32GB RAM, 1TB SSD. Perfect condition, used for 6 months.",
      price: "0.5",
      category: "Electronics",
      seller: "0x1234...5678",
      createdAt: "2026-01-20",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    },
    {
      id: "2",
      title: "Designer Watch",
      description: "Luxury Swiss automatic watch with leather strap. Comes with original box and papers.",
      price: "1.2",
      category: "Fashion",
      seller: "0xabcd...efgh",
      createdAt: "2026-01-22",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
    },
    {
      id: "3",
      title: "Vintage Camera",
      description: "Rare vintage film camera from the 1970s. Fully functional and well-maintained.",
      price: "0.3",
      category: "Collectibles",
      seller: "0x9876...4321",
      createdAt: "2026-01-23",
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400",
    },
  ]);

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

  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-6 py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px]"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-[#70ff00]">Marketplace</span>
          </h1>
          <p className="text-gray-400">Discover and trade items securely with dual-stake escrow</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm mb-8">
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
        {filteredListings.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-12 backdrop-blur-sm text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No listings found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm hover:border-[#70ff00]/30 transition-all duration-300 group">
                {listing.image && (
                  <div className="w-full h-48 overflow-hidden bg-black/50 relative">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-semibold text-[#70ff00]">
                      {listing.category}
                    </div>
                  </div>
                )}
                
                <div className="p-6">
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

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#70ff00]/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#70ff00]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-400 text-xs font-mono">{listing.seller}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{listing.createdAt}</span>
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Confirm Purchase</h2>
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
              {selectedListing.image && (
                <div className="w-full h-64 overflow-hidden rounded-xl mb-6 bg-black/50">
                  <img 
                    src={selectedListing.image} 
                    alt={selectedListing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

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
                    // TODO: Connect to smart contract
                    alert("Connecting to wallet... This will trigger the buyerDeposit function");
                    closeBuyModal();
                  }}
                  className="flex-1 px-6 py-3 bg-[#70ff00] text-black rounded-lg font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,255,0,0.4)] hover:scale-[1.02]"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
