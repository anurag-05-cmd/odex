export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-32">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
          Welcome to{" "}
          <span className="text-[#70ff00]">Odex</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
          The next generation decentralized exchange platform
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <button className="relative bg-[#70ff00] text-black px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(112,255,0,0.8)] overflow-hidden group">
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
          <button className="relative bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:border-[#70ff00]/50 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(112,255,0,0.3)] overflow-hidden group">
            <span className="relative z-10">Learn More</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#70ff00]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    </div>
  );
}
