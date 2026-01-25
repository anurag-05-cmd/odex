export default function Faucet() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-4 sm:px-6 py-24 sm:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-40 left-20 w-[300px] h-[300px] bg-purple-500/3 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-full mb-6 backdrop-blur-sm shadow-[0_0_30px_rgba(112,255,0,0.1)]">
            <span className="w-2 h-2 bg-[#70ff00] rounded-full animate-pulse shadow-[0_0_10px_rgba(112,255,0,0.8)]"></span>
            <span className="text-white/90 text-xs sm:text-sm font-medium">Sepolia Testnet</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Test Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70ff00] via-[#5acc00] to-[#70ff00]">Faucet</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
            Get free Sepolia ETH to test Odex without spending real funds
          </p>
        </div>

        {/* Main Faucet Hero */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#70ff00]/20 via-[#5acc00]/20 to-[#70ff00]/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
          <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent border-2 border-white/20 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#70ff00]/30 to-[#5acc00]/20 shadow-[0_0_40px_rgba(112,255,0,0.4)] flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#70ff00]/20 to-transparent animate-pulse"></div>
                  <svg className="w-14 h-14 sm:w-20 sm:h-20 text-[#70ff00] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Get Your Test Tokens</h2>
                <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl">
                  Access Google Cloud's faucet to receive test ETH instantly. These tokens let you interact with Odex's smart contracts and experience P2P trading without any real costs.
                </p>
                
                <a 
                  href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-[#70ff00] via-[#5acc00] to-[#70ff00] text-black rounded-xl font-bold text-lg sm:text-xl shadow-[0_20px_50px_rgba(112,255,0,0.3)] hover:shadow-[0_20px_70px_rgba(112,255,0,0.5),0_0_80px_rgba(112,255,0,0.3)] hover:scale-105 transition-all duration-500 group/btn"
                >
                  <span>Open Faucet</span>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover/btn:translate-x-2 group-hover/btn:scale-110 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Timeline */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-10 text-center">
            Quick <span className="text-[#70ff00]">Start Guide</span>
          </h3>
          
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#70ff00] via-[#5acc00] to-purple-500"></div>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative pl-16">
                <div className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_20px_rgba(112,255,0,0.5)] flex items-center justify-center z-10">
                  <span className="text-black font-bold">1</span>
                </div>
                <div className="group">
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#70ff00] transition-colors">Connect Your Wallet</h4>
                  <p className="text-gray-400 leading-relaxed">Make sure you have a Web3 wallet like MetaMask installed and set to the Sepolia network.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative pl-16">
                <div className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_20px_rgba(112,255,0,0.5)] flex items-center justify-center z-10">
                  <span className="text-black font-bold">2</span>
                </div>
                <div className="group">
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#70ff00] transition-colors">Visit the Faucet</h4>
                  <p className="text-gray-400 leading-relaxed">Click the "Open Faucet" button above to access Google Cloud's Sepolia faucet.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative pl-16">
                <div className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_20px_rgba(112,255,0,0.5)] flex items-center justify-center z-10">
                  <span className="text-black font-bold">3</span>
                </div>
                <div className="group">
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#70ff00] transition-colors">Request Test ETH</h4>
                  <p className="text-gray-400 leading-relaxed">Enter your wallet address and complete any verification steps required by the faucet.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative pl-16">
                <div className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#70ff00] to-[#5acc00] border-4 border-black shadow-[0_0_20px_rgba(112,255,0,0.5)] flex items-center justify-center z-10">
                  <span className="text-black font-bold">4</span>
                </div>
                <div className="group">
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#70ff00] transition-colors">Start Trading</h4>
                  <p className="text-gray-400 leading-relaxed">Once you receive the tokens, you can start testing Odex's P2P trading features!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes - Feature Highlights */}
        <div className="space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Important <span className="text-[#70ff00]">Information</span>
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Testnet Only</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  These tokens have no real value and can only be used on the Sepolia test network. Never use them on mainnet.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 shadow-[0_0_30px_rgba(234,179,8,0.3)] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Rate Limits</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Faucets typically have rate limits to prevent abuse. You may need to wait between requests.
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Safe Testing</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Always test your contracts on testnet before deploying to mainnet to avoid costly mistakes.
                </p>
              </div>
            </div>
          </div>

          <div className="relative group mt-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#70ff00]/10 to-transparent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/5 to-transparent border border-[#70ff00]/30 rounded-2xl p-8 backdrop-blur-sm hover:border-[#70ff00]/50 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="w-14 h-14 rounded-xl bg-[#70ff00]/20 shadow-[0_0_30px_rgba(112,255,0,0.4)] flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">Need Help?</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Join our community if you encounter issues or need additional testnet resources. We're here to help you get started with Odex!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
