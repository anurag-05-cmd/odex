"use client";

import { useState } from "react";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  status: "active" | "sold" | "cancelled";
  createdAt: string;
  image?: string;
}

export default function Listings() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "create" | "myListings">("dashboard");
  const [listings, setListings] = useState<Listing[]>([
    {
      id: "1",
      title: "Gaming Laptop",
      description: "High-performance gaming laptop with RTX 4070",
      price: "0.5",
      category: "Electronics",
      status: "active",
      createdAt: "2026-01-20",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

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

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newListing: Listing = {
      id: Date.now().toString(),
      ...formData,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setListings([...listings, newListing]);
    setFormData({ title: "", description: "", price: "", category: "", image: "" });
    setImagePreview("");
    setActiveTab("myListings");
  };

  const handleCancelListing = (id: string) => {
    setListings(listings.map(l => l.id === id ? { ...l, status: "cancelled" } : l));
  };

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === "active").length,
    sold: listings.filter(l => l.status === "sold").length,
    totalVolume: listings.reduce((acc, l) => acc + parseFloat(l.price || "0"), 0).toFixed(2),
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-6 py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px]"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My <span className="text-[#70ff00]">Listings</span>
          </h1>
          <p className="text-gray-400">Manage your listings and track your trading activity</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap ${
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
                  <div key={listing.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
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

        {/* Create Listing Tab */}
        {activeTab === "create" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Listing</h2>
              
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
                  className="w-full px-8 py-4 bg-[#70ff00] text-black rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,255,0,0.4)] hover:scale-[1.02]"
                >
                  Create Listing
                </button>
              </form>
            </div>
          </div>
        )}

        {/* My Listings Tab */}
        {activeTab === "myListings" && (
          <div className="space-y-6">
            {listings.length === 0 ? (
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
                  <div key={listing.id} className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm hover:border-[#70ff00]/30 transition-all duration-300">
                    {listing.image && (
                      <div className="w-full h-48 overflow-hidden bg-black/50">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-full h-full object-cover"
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
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {listing.status.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-xs">{listing.createdAt}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400 text-sm">{listing.category}</span>
                        <span className="text-[#70ff00] font-bold text-lg">{listing.price} ETH</span>
                      </div>

                      {listing.status === "active" && (
                        <button
                          onClick={() => handleCancelListing(listing.id)}
                          className="w-full px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-red-500/20"
                        >
                          Cancel Listing
                        </button>
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
