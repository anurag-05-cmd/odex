export default function About() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden px-6 py-32">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
      <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-[#70ff00]/3 rounded-full blur-[100px]"></div>
      
      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 flex items-center justify-center gap-4">
            About <img src="/logo_dark.png" alt="Odex" className="h-12 md:h-16" />
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A trustless P2P trading platform built on dual-stake escrow mechanics
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-12 backdrop-blur-sm mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">How Odex Works</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Seller Creates Listing</h3>
                <p className="text-gray-400">The seller initiates the trade by creating a listing for their item with the agreed price.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Buyer Stakes Double</h3>
                <p className="text-gray-400">The buyer deposits 2x the item price, demonstrating commitment to completing the transaction honestly.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Seller Stakes 1.5x</h3>
                <p className="text-gray-400">The seller deposits 1.5x the item price, ensuring both parties have skin in the game.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold text-lg">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Seller Ships & Confirms</h3>
                <p className="text-gray-400">The seller ships the item and marks it as released. A 5-minute confirmation window begins.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#70ff00]/10 border-2 border-[#70ff00] flex items-center justify-center">
                <span className="text-[#70ff00] font-bold text-lg">5</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Buyer Confirms Delivery</h3>
                <p className="text-gray-400">Once the item is received, the buyer confirms delivery. Both parties receive their stakes back, and the seller receives payment.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#70ff00]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Sequential Process</h3>
            <p className="text-gray-400 text-sm">Each step must be completed in order. The process cannot be rushed or skipped—this ensures security and accountability at every stage.</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#70ff00]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Simultaneous Actions</h3>
            <p className="text-gray-400 text-sm">Steps cannot happen in parallel. Each action depends on the previous state being confirmed on-chain, preventing fraud and ensuring proper flow.</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#70ff00]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Permanent Lock Protection</h3>
            <p className="text-gray-400 text-sm">Once both parties have staked and the seller confirms shipment, there's no refund option. This ensures commitment and prevents sellers from backing out after receiving stakes.</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-[#70ff00]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#70ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Bad Actor Deterrent</h3>
            <p className="text-gray-400 text-sm">If either party attempts malicious behavior, funds remain locked until the dispute is resolved. Neither party receives their stake back—incentivizing honest resolution.</p>
          </div>
        </div>

        {/* Critical Security Features */}
        <div className="bg-gradient-to-br from-red-500/5 to-white/[0.02] border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm mb-12">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Critical: Point of No Return</h2>
              <p className="text-gray-300 mb-4">
                Understanding the permanent lock mechanism is essential for all users:
              </p>
            </div>
          </div>
          
          <div className="space-y-4 pl-16">
            <div className="bg-black/30 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold">After Seller Confirmation</h4>
              </div>
              <p className="text-gray-400 text-sm pl-9">
                Once both parties have staked their amounts and the seller confirms shipment, <strong className="text-red-400">refunds are permanently disabled</strong>. This creates absolute commitment from the seller to deliver the item.
              </p>
            </div>
            
            <div className="bg-black/30 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold">Dispute Lock Mechanism</h4>
              </div>
              <p className="text-gray-400 text-sm pl-9">
                If anyone attempts to act maliciously (false claims, refusal to confirm delivery, etc.), the system automatically locks all staked funds. <strong className="text-red-400">Neither party can access their stakes</strong> until they work together to resolve the dispute honestly.
              </p>
            </div>
            
            <div className="bg-black/30 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold">Why This Works</h4>
              </div>
              <p className="text-gray-400 text-sm pl-9">
                The threat of permanently locked funds creates a powerful incentive for both parties to act honestly. Scamming becomes economically irrational—you'd lose your entire stake for no gain.
              </p>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-[#70ff00]/20 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-4">Why Sequential Steps Matter</h2>
          <p className="text-gray-300 mb-4">
            The strict ordering of steps isn't a limitation—it's a feature. By requiring each action to happen in sequence, Odex ensures:
          </p>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-[#70ff00] mt-1">▸</span>
              <span><strong className="text-white">Accountability:</strong> Every party must complete their commitments before the next step begins</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#70ff00] mt-1">▸</span>
              <span><strong className="text-white">Transparency:</strong> The blockchain tracks the exact state of every trade at all times</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#70ff00] mt-1">▸</span>
              <span><strong className="text-white">Security:</strong> Attempting steps out of order automatically fails, preventing exploits</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#70ff00] mt-1">▸</span>
              <span><strong className="text-white">Fair Treatment:</strong> Both parties are protected by the same rules and same stake incentives</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
