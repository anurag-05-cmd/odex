export default function Home() {
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
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-nabla)' }}>
              <span className="text-white">Trade without</span>
              <br />
              <span className="text-[#70ff00]">
                intermediaries
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Dual-stake escrow ensures both parties are committed to honest transactions. No middleman, no trust required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-[#70ff00] text-black rounded-lg font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(112,255,0,0.4)]">
                <span className="relative z-10">Start Trading</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-lg font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[#70ff00]/50">
                Learn More
              </button>
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
              <div key={index} className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm hover:bg-white/[0.05] hover:border-[#70ff00]/20 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#70ff00]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-[#70ff00]/40 text-4xl font-bold mb-4">{item.step}</div>
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
