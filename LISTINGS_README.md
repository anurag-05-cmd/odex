# Odex Marketplace - Listings Integration

This update integrates the listings page with the Odex smart contract and IPFS storage using Storacha.

## Setup Instructions

### 1. Install Dependencies
```bash
bun install
```

### 2. Deploy the Smart Contract
First, make sure your Hardhat configuration is set up for your target network, then deploy:

```bash
npx hardhat run scripts/deploy-odex.ts --network <your-network>
```

This will output a contract address that you need for the next step.

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and add your contract address:

```bash
cp .env.example .env
```

Edit `.env` and add:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x_your_contract_address_here
```

### 4. Run the Application
```bash
bun dev
```

## Features Implemented

### Smart Contract Integration
- **Create Listing**: Connects to the `createListing` function in the Odex contract
- **State Management**: Reads trade states from the contract and displays appropriate status
- **Real-time Updates**: Automatically refreshes listings every 30 seconds to check for state changes

### IPFS Integration with Storacha
- **Image Upload**: Uploads listing images to IPFS using Storacha client
- **Metadata Storage**: Stores listing metadata (title, description, category) on IPFS
- **Auto-cleanup**: Removes images and metadata from IPFS when trades are completed (state 4)

### Trade State Handling
- **State 0 (Created)**: Shows as "Active" - available for buyers
- **State 1 (Buyer Staked)**: Shows as "Buyer Staked" - waiting for seller to stake
- **State 2 (Active)**: Shows as "In Progress" - both parties have staked
- **State 3 (Released)**: Shows as "Released" - item released, waiting for confirmation
- **State 4 (Completed)**: Trade completed - listing is removed and IPFS files deleted
- **State 5 (Cancelled)**: Shows as "Can Relist" - seller can create new listing

### User Interface
- **Wallet Connection**: Automatically prompts for wallet connection
- **Loading States**: Shows loading indicators during contract interactions
- **Error Handling**: Displays user-friendly error messages
- **Re-listing**: Allows sellers to re-list items when trade state is 5

## Trade Flow
1. Seller creates listing with image and metadata
2. Image and metadata are uploaded to IPFS
3. Listing is created on the smart contract
4. Listing appears in marketplace and seller's "My Listings"
5. When trade progresses through states, UI updates accordingly
6. When trade completes (state 4), IPFS files are deleted and listing is removed
7. If trade is cancelled (state 5), seller can re-list the item

## Notes
- Make sure your wallet is connected to the same network as the deployed contract
- IPFS files are stored on Storacha network using the provided DID key
- The app automatically handles IPFS gateway fallbacks for better reliability
- Contract address must be set in environment variables for the app to work