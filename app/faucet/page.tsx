export default function Faucet() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-6 py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute top-40 right-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px]"></div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#70ff00] rounded-full animate-pulse"></span>
            <span className="text-white/80 text-sm">Sepolia Testnet</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Test Token <span className="text-[#70ff00]">Faucet</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get free Sepolia ETH to test Odex without spending real funds
          </p>
        </div>

        {/* Main Faucet Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm mb-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-16 h-16 rounded-xl bg-[#70ff00]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3">Get Sepolia ETH</h2>
              <p className="text-gray-400 mb-6">
                Use Google Cloud's faucet to receive test ETH on the Sepolia testnet. You'll need these tokens to interact with Odex's smart contracts and pay for gas fees during testing.
              </p>
              
              <a 
                href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#70ff00] text-black rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,255,0,0.4)] hover:scale-105 group"
              >
                <span>Open Faucet</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-sm mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">How to Use the Faucet</h3>
          
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold">1</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Connect Your Wallet</h4>
                <p className="text-gray-400 text-sm">Make sure you have a Web3 wallet like MetaMask installed and set to the Sepolia network.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold">2</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Visit the Faucet</h4>
                <p className="text-gray-400 text-sm">Click the "Open Faucet" button above to access Google Cloud's Sepolia faucet.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold">3</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Request Test ETH</h4>
                <p className="text-gray-400 text-sm">Enter your wallet address and complete any verification steps required by the faucet.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold">4</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Start Trading</h4>
                <p className="text-gray-400 text-sm">Once you receive the tokens, you can start testing Odex's P2P trading features!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">Testnet Only</h4>
            </div>
            <p className="text-gray-400 text-sm">
              These tokens have no real value and can only be used on the Sepolia test network. Never use them on mainnet.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">Rate Limits</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Faucets typically have rate limits to prevent abuse. You may need to wait between requests.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">Safe Testing</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Always test your contracts on testnet before deploying to mainnet to avoid costly mistakes.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#70ff00]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">Need Help?</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Join our community if you encounter issues or need additional testnet resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
