<div align="center">
  <img src="public/Odex.png" alt="Odex Logo" width="200"/>
  
  # Odex - Trustless P2P Trading Platform
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-70ff00?style=for-the-badge&logo=vercel)](https://odex.expose.software)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  [![Solidity](https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  
  **Trade without intermediaries. No trust required.**
  
  [Live Demo](https://odex.expose.software) • [Documentation](#documentation) • [Features](#features) • [Smart Contract](#smart-contract)
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Smart Contract](#smart-contract)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 Overview

**Odex** is a revolutionary decentralized peer-to-peer trading platform that eliminates the need for intermediaries through an innovative **dual-stake escrow mechanism**. Built on blockchain technology, Odex ensures secure, trustless transactions where both buyers and sellers are financially committed to honest behavior.

### 🌐 Live Platform
**[https://odex.expose.software](https://odex.expose.software)**

### The Problem We Solve

Traditional P2P marketplaces face critical challenges:
- 🚫 Centralized control and censorship
- 💰 High intermediary fees (5-20%)
- 🤝 Trust dependency on unknown parties
- ⚖️ Dispute resolution delays and biases
- 🔒 Custodial risk of funds

### Our Solution

Odex implements a **trustless dual-stake escrow system**:
- **No intermediaries** - Direct peer-to-peer transactions
- **Economic incentives** - Both parties stake to ensure honesty
- **Automatic resolution** - Smart contracts enforce rules
- **Zero fees** - No platform commissions
- **Complete transparency** - All transactions on-chain

---

## ✨ Key Features

### 🔐 Dual-Stake Escrow System
- **Buyer stakes 2x** the item price
- **Seller stakes 1.5x** the item price
- Stakes returned on successful completion
- Economic disincentive for fraud

### 🛡️ Critical Security Features

#### ⏱️ Time-Based Protections
- **5-minute activation window** - Seller must activate within 5 minutes of staking or buyer gets refunded
- **Automatic refunds** - Protects against seller inaction
- **State-based validation** - Enforces proper transaction flow

#### 🎯 State Machine Architecture
```
Created → BuyerStaked → Active → Released → Completed
    ↓          ↓           ↓
Cancelled  Cancelled   Refunded
```

#### 💎 Smart Contract Security
- **Immutable logic** - No upgradeable vulnerabilities
- **State validation** - Prevents unauthorized state transitions
- **Reentrancy protection** - Uses checks-effects-interactions pattern
- **Access control** - Modifier-based permission system

### 🎨 Modern User Experience
- **Responsive design** - Works seamlessly on all devices
- **Real-time updates** - Live transaction status monitoring
- **Intuitive interface** - Clean, professional UI/UX
- **Wallet integration** - Seamless Web3 connectivity

### 🚀 Core Functionality
- **Create listings** - Sellers list items with descriptions and prices
- **Browse marketplace** - Filter and search available listings
- **Secure trading** - Stake-based transaction protection
- **Trade management** - Track all active and completed trades
- **Testnet faucet** - Easy testing environment access

---

## 🔄 How It Works

### Step 1: Create Listing
Seller creates a listing by signing with their wallet. No stake required yet.

### Step 2: Buyer Stakes
Buyer stakes **2x the item price** to show commitment and signal interest.

### Step 3: Seller Activates
Seller has **5 minutes** to stake **1.5x the item price** or buyer gets automatic refund.

### Step 4: Item Shipped
Seller ships the item. Both stakes are locked in the smart contract.

### Step 5: Buyer Confirms
Buyer confirms receipt. Stakes returned, seller receives payment.

### Safety Mechanisms
- ✅ Seller doesn't respond → Buyer refunded automatically
- ✅ Buyer doesn't confirm → Dispute resolution (future enhancement)
- ✅ All actions recorded on-chain for transparency

---

## 🛠️ Technology Stack

### Frontend
- **[Next.js 16.1.4](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.3](https://react.dev/)** - UI library with latest features
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Type-safe development

### Blockchain
- **[Ethers.js 6.16](https://docs.ethers.org/)** - Ethereum interaction library
- **[Hardhat 3.1.5](https://hardhat.org/)** - Ethereum development environment
- **[Solidity 0.8.19](https://soliditylang.org/)** - Smart contract language

### Additional Tools
- **[@reown/appkit](https://reown.com/)** - Wallet connection UI
- **[Google Generative AI](https://ai.google.dev/)** - Content moderation
- **[Mocha](https://mochajs.org/)** - Smart contract testing framework

---

## 📜 Smart Contract

### Contract: `Odex.sol`

The core smart contract implements a robust state machine with the following key functions:

#### Main Functions

```solidity
// Create a new listing
function createListing(
    uint256 _price,
    string memory _itemName,
    string memory _itemDescription,
    string memory _category
) external

// Buyer stakes 2x the price
function buyerStake(uint256 _tradeId) external payable

// Seller stakes 1.5x the price (5-min window)
function sellerDeposit(uint256 _tradeId) external payable

// Seller marks item as shipped
function releaseItem(uint256 _tradeId) external

// Buyer confirms receipt
function confirmReceipt(uint256 _tradeId) external

// Cancel listing (only in Created state)
function cancelListing(uint256 _tradeId) external

// Check for expired activation window
function checkActivationTimeout(uint256 _tradeId) external
```

#### Events
- `ListingCreated` - New listing published
- `BuyerStaked` - Buyer committed funds
- `Active` - Both parties staked, trade live
- `ItemReleased` - Seller shipped item
- `TradeCompleted` - Successful transaction
- `Refunded` - Automatic refund triggered

#### State Management
The contract enforces strict state transitions:
- `Created` - Initial listing state
- `BuyerStaked` - Buyer has staked funds
- `Active` - Both parties staked, item can be shipped
- `Released` - Seller marked as shipped
- `Completed` - Buyer confirmed, funds distributed
- `Cancelled` - Listing cancelled

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun runtime**
- **MetaMask** or compatible Web3 wallet
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/odex.git
cd odex
```

2. **Install dependencies**
```bash
# Using bun (recommended)
bun install

# Or using npm
npm install

# Or using yarn
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Wallet Connect Project ID
NEXT_PUBLIC_PROJECT_ID=your_project_id

# Contract Deployment
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Network RPC URLs (optional)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_key
```

4. **Run development server**
```bash
bun dev
# or
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
odex/
├── app/                        # Next.js App Router
│   ├── about/                 # About page
│   ├── buyer-trades/          # Buyer's trade dashboard
│   ├── contexts/              # React contexts
│   │   └── NotificationContext.tsx
│   ├── faucet/               # Testnet faucet page
│   ├── listings/             # Seller's listing management
│   ├── marketplace/          # Browse and buy listings
│   ├── utils/                # Utility functions
│   │   ├── constants.ts      # Contract ABIs & addresses
│   │   └── moderation.ts     # Content filtering
│   ├── globals.css           # Global styles & animations
│   ├── layout.tsx            # Root layout with navbar
│   └── page.tsx              # Landing page
├── contracts/                 # Smart contracts
│   └── Odex.sol              # Main escrow contract
├── scripts/                   # Deployment scripts
│   └── deploy.ts             # Hardhat deployment
├── test/                      # Contract tests
├── public/                    # Static assets
│   └── Odex.png              # Logo
├── hardhat.config.ts         # Hardhat configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS config
└── tsconfig.json             # TypeScript config
```

---

## 💻 Development

### Running Tests

```bash
# Compile contracts
npx hardhat compile

# Run contract tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Test coverage
npx hardhat coverage
```

### Local Blockchain

```bash
# Start local Hardhat node
npx hardhat node

# Deploy to local network (new terminal)
npx hardhat run scripts/deploy.ts --network localhost
```

### Smart Contract Deployment

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Verify contract on Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit

# Format code (if prettier configured)
npm run format
```

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

The easiest way to deploy Odex is using [Vercel](https://vercel.com):

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy automatically

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/odex)

### Alternative Platforms
- **Netlify** - Configure build command: `npm run build`
- **AWS Amplify** - Full-stack deployment
- **Cloudflare Pages** - Edge deployment

### Smart Contract Networks

Supported networks (configured in `hardhat.config.ts`):
- **Sepolia** - Ethereum testnet
- **Goerli** - Ethereum testnet
- **Mumbai** - Polygon testnet
- **Mainnet** - Production deployment

---

## 🔒 Security

### Smart Contract Security

✅ **Implemented Best Practices**
- State validation at every step
- Reentrancy protection
- Access control modifiers
- Time-based protections
- Integer overflow protection (Solidity 0.8+)

⚠️ **Known Limitations**
- Dispute resolution mechanism in development
- Advanced timeout handling being enhanced
- Multi-sig capabilities planned

### Audit Status
🔄 **Not yet audited** - Use at your own risk on mainnet

### Bug Bounty
Found a security issue? Please responsibly disclose to: security@odex.com

---

## 🤝 Contributing

We welcome contributions from the community!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Links

- **Live Platform**: [https://odex.expose.software](https://odex.expose.software)
- **Documentation**: [Coming Soon]
- **Twitter**: [@OdexProtocol](https://twitter.com/OdexProtocol)
- **Discord**: [Join Community](https://discord.gg/odex)
- **Email**: contact@odex.com

---

## 🙏 Acknowledgments

- Built with ❤️ for DUHacks 5.0
- Inspired by the vision of true decentralization
- Thanks to the Ethereum community for amazing tools

---

<div align="center">
  
  **⭐ Star us on GitHub — it motivates us a lot!**
  
  Made with 💚 by the Odex Team
  
  [Website](https://odex.expose.software) • [GitHub](https://github.com/yourusername/odex) • [Twitter](https://twitter.com/OdexProtocol)
  
</div>
