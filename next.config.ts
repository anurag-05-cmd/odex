import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: [
      'localhost',
      'localhost:3000',
      '127.0.0.1',
      '127.0.0.1:3000',
      // Allow ngrok domains - they follow pattern *.ngrok-free.app
      /^.*\.ngrok-free\.app$/,
      /^.*\.ngrok\.io$/,
      /^.*\.ngrok-pro\.app$/,
    ],
  },
};

export default nextConfig;
