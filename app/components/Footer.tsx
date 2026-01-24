import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <Image
              src="/logo_dark.png"
              alt="Odex Logo"
              width={90}
              height={90}
              className="mb-3"
            />
            <p className="text-gray-400 text-sm">
              The next generation decentralized exchange platform
            </p>
          </div>

          {/* Sitemap - Platform */}
          <div>
            <h4 className="text-white font-semibold mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-[#70ff00] text-sm transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-400 hover:text-[#70ff00] text-sm transition-colors">
                  Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#70ff00] text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faucet" className="text-gray-400 hover:text-[#70ff00] text-sm transition-colors">
                  Faucet
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 Odex. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Developed by{" "}
            <a 
              href="https://expose.software" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#70ff00] hover:underline font-medium"
            >
              EXPOSE
            </a>
            {" "}for DU Hacks 5.0
          </p>
        </div>
      </div>
    </footer>
  );
}
