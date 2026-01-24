import type { Metadata } from "next";
import { Space_Grotesk, Nabla, Bakbak_One } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const nabla = Nabla({
  variable: "--font-nabla",
  subsets: ["latin"],
  weight: ["400"],
});

const bakbakOne = Bakbak_One({
  variable: "--font-bakbak-one",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Odex - Decentralized Exchange",
  description: "The next generation decentralized exchange platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${nabla.variable} ${bakbakOne.variable} antialiased bg-black min-h-screen flex flex-col font-sans`}
        style={{ fontFamily: 'var(--font-space-grotesk)' }}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
