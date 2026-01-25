export default function About() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-4 sm:px-6 py-24 sm:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-[300px] h-[300px] bg-purple-500/3 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span>About</span> 
            <img src="/logo_dark.png" alt="Odex" className="h-12 sm:h-14 md:h-20 drop-shadow-[0_0_30px_rgba(112,255,0,0.3)]" />
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
            A trustless P2P trading platform built on <span className="text-[#70ff00] font-semibold">dual-stake escrow mechanics</span>
          </p>
        </div>

        {/* How It Works - Visual Flow */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70ff00] via-[#5acc00] to-[#70ff00]">Odex</span> Works
          </h2>
          
          <div className="relative">
            {/* Flow Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#70ff00] via-[#5acc00] to-purple-500 transform -translate-x-1/2"></div>
            
            <div className="space-y-16">
              {/* Step 1 - Left */}
              <div className="relative lg:pr-1/2 lg:mr-8">
                <div className="hidden lg:block absolute right-0 top-8 w-8 h-0.5 bg-[#70ff00]"></div>
                <div className="hidden lg:flex absolute right-[-2rem] top-6 w-12 h-12 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_30px_rgba(112,255,0,0.6)] items-center justify-center z-10">
                  <span className="text-black font-bold text-lg">1</span>
                </div>
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl hover:scale-105 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  <h3 className="text-2xl font-bold text-white mb-3">Seller Creates Listing</h3>
                  <p className="text-gray-300 leading-relaxed">The seller initiates the trade by creating a listing for their item with the agreed price.</p>
                </div>
              </div>

              {/* Step 2 - Right */}
              <div className="relative lg:pl-1/2 lg:ml-8">
                <div className="hidden lg:block absolute left-0 top-8 w-8 h-0.5 bg-[#70ff00]"></div>
                <div className="hidden lg:flex absolute left-[-2rem] top-6 w-12 h-12 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_30px_rgba(112,255,0,0.6)] items-center justify-center z-10">
                  <span className="text-black font-bold text-lg">2</span>
                </div>
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl hover:scale-105 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  <h3 className="text-2xl font-bold text-white mb-3">Buyer Stakes Double</h3>
                  <p className="text-gray-300 leading-relaxed">The buyer deposits 2x the item price, demonstrating commitment to completing the transaction honestly.</p>
                </div>
              </div>

              {/* Step 3 - Left */}
              <div className="relative lg:pr-1/2 lg:mr-8">
                <div className="hidden lg:block absolute right-0 top-8 w-8 h-0.5 bg-[#70ff00]"></div>
                <div className="hidden lg:flex absolute right-[-2rem] top-6 w-12 h-12 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_30px_rgba(112,255,0,0.6)] items-center justify-center z-10">
                  <span className="text-black font-bold text-lg">3</span>
                </div>
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl hover:scale-105 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  <h3 className="text-2xl font-bold text-white mb-3">Seller Stakes 1.5x</h3>
                  <p className="text-gray-300 leading-relaxed">The seller deposits 1.5x the item price, ensuring both parties have skin in the game.</p>
                </div>
              </div>

              {/* Step 4 - Right */}
              <div className="relative lg:pl-1/2 lg:ml-8">
                <div className="hidden lg:block absolute left-0 top-8 w-8 h-0.5 bg-[#70ff00]"></div>
                <div className="hidden lg:flex absolute left-[-2rem] top-6 w-12 h-12 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_30px_rgba(112,255,0,0.6)] items-center justify-center z-10">
                  <span className="text-black font-bold text-lg">4</span>
                </div>
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl hover:scale-105 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  <h3 className="text-2xl font-bold text-white mb-3">Seller Ships & Confirms</h3>
                  <p className="text-gray-300 leading-relaxed">The seller ships the item and marks it as released. A 5-minute confirmation window begins.</p>
                </div>
              </div>

              {/* Step 5 - Left */}
              <div className="relative lg:pr-1/2 lg:mr-8">
                <div className="hidden lg:block absolute right-0 top-8 w-8 h-0.5 bg-[#70ff00]"></div>
                <div className="hidden lg:flex absolute right-[-2rem] top-6 w-12 h-12 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_30px_rgba(112,255,0,0.6)] items-center justify-center z-10">
                  <span className="text-black font-bold text-lg">5</span>
                </div>
                <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl hover:scale-105 transition-all duration-500 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                  <h3 className="text-2xl font-bold text-white mb-3">Buyer Confirms Delivery</h3>
                  <p className="text-gray-300 leading-relaxed">Once the item is received, the buyer confirms delivery. Both parties receive their stakes back, and the seller receives payment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Principles - Horizontal Layout */}
        <div className="mb-16">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
            Core <span className="text-[#70ff00]">Principles</span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#70ff00]/20 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-[#70ff00]/30 rounded-2xl p-8 backdrop-blur-sm hover:border-[#70ff00]/60 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#70ff00]/20 shadow-[0_0_30px_rgba(112,255,0,0.4)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-3">Sequential Process</h4>
                    <p className="text-gray-300 leading-relaxed">Each step must be completed in order. The process cannot be rushed or skipped—this ensures security and accountability at every stage.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#70ff00]/20 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-[#70ff00]/30 rounded-2xl p-8 backdrop-blur-sm hover:border-[#70ff00]/60 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#70ff00]/20 shadow-[0_0_30px_rgba(112,255,0,0.4)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-3">No Simultaneous Actions</h4>
                    <p className="text-gray-300 leading-relaxed">Steps cannot happen in parallel. Each action depends on the previous state being confirmed on-chain, preventing fraud and ensuring proper flow.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#70ff00]/20 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-[#70ff00]/30 rounded-2xl p-8 backdrop-blur-sm hover:border-[#70ff00]/60 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#70ff00]/20 shadow-[0_0_30px_rgba(112,255,0,0.4)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-3">Permanent Lock Protection</h4>
                    <p className="text-gray-300 leading-relaxed">Once both parties have staked and the seller confirms shipment, there's no refund option. This ensures commitment and prevents sellers from backing out after receiving stakes.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#70ff00]/20 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-[#70ff00]/30 rounded-2xl p-8 backdrop-blur-sm hover:border-[#70ff00]/60 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-[#70ff00]/20 shadow-[0_0_30px_rgba(112,255,0,0.4)] flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-3">Bad Actor Deterrent</h4>
                    <p className="text-gray-300 leading-relaxed">If either party attempts malicious behavior, funds remain locked until the dispute is resolved. Neither party receives their stake back—incentivizing honest resolution.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Security Features */}
        <div className="relative group mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border-2 border-red-500/40 rounded-3xl p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(239,68,68,0.3)]">
            <div className="flex flex-col lg:flex-row items-start gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.5)] flex items-center justify-center flex-shrink-0">
                <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Critical: Point of No Return</h2>
                <p className="text-gray-200 text-lg leading-relaxed">
                  Understanding the permanent lock mechanism is essential for all users. Once activated, certain actions become irreversible by design.
                </p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="bg-black/40 border-l-4 border-red-500 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-red-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">After Seller Confirmation</h4>
                    <p className="text-gray-300 leading-relaxed">
                      Once both parties have staked their amounts and the seller confirms shipment, <strong className="text-red-400">refunds are permanently disabled</strong>. This creates absolute commitment from the seller to deliver the item.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 border-l-4 border-red-500 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-red-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">Dispute Lock Mechanism</h4>
                    <p className="text-gray-300 leading-relaxed">
                      If anyone attempts to act maliciously (false claims, refusal to confirm delivery, etc.), the system automatically locks all staked funds. <strong className="text-red-400">Neither party can access their stakes</strong> until they work together to resolve the dispute honestly.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 border-l-4 border-green-500 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded bg-green-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">Why This Works</h4>
                    <p className="text-gray-300 leading-relaxed">
                      The threat of permanently locked funds creates a powerful incentive for both parties to act honestly. Scamming becomes economically irrational—you'd lose your entire stake for no gain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why It Matters - Closing Statement */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#70ff00]/20 to-transparent rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-[#70ff00]/40 rounded-3xl p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">
              Why Sequential Steps <span className="text-[#70ff00]">Matter</span>
            </h2>
            <p className="text-gray-200 text-lg mb-8 text-center max-w-4xl mx-auto leading-relaxed">
              The strict ordering of steps isn't a limitation—it's a feature. By requiring each action to happen in sequence, Odex ensures:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-[#70ff00] flex-shrink-0 mt-2 shadow-[0_0_10px_rgba(112,255,0,0.8)]"></div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Accountability</h4>
                  <p className="text-gray-300 leading-relaxed">Every party must complete their commitments before the next step begins</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-[#70ff00] flex-shrink-0 mt-2 shadow-[0_0_10px_rgba(112,255,0,0.8)]"></div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Transparency</h4>
                  <p className="text-gray-300 leading-relaxed">The blockchain tracks the exact state of every trade at all times</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-[#70ff00] flex-shrink-0 mt-2 shadow-[0_0_10px_rgba(112,255,0,0.8)]"></div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Security</h4>
                  <p className="text-gray-300 leading-relaxed">Attempting steps out of order automatically fails, preventing exploits</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-[#70ff00] flex-shrink-0 mt-2 shadow-[0_0_10px_rgba(112,255,0,0.8)]"></div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">Fair Treatment</h4>
                  <p className="text-gray-300 leading-relaxed">Both parties are protected by the same rules and same stake incentives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
