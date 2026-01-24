import hardhatEthersPlugin from "@nomicfoundation/hardhat-ethers";
import { defineConfig } from "hardhat/config";
import "dotenv/config";

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
let SEPOLIA_PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (SEPOLIA_PRIVATE_KEY && !SEPOLIA_PRIVATE_KEY.startsWith("0x")) {
  SEPOLIA_PRIVATE_KEY = `0x${SEPOLIA_PRIVATE_KEY}`;
}

export default defineConfig({
  plugins: [hardhatEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainType: "l1",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: SEPOLIA_RPC_URL,
      accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
    },
  },
});