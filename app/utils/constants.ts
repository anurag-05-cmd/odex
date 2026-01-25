// Contract configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

// IPFS configuration
export const STORACHA_KEY = process.env.STORACHA_KEY || "";

// Trade States
export const TRADE_STATES = {
  CREATED: 0,
  BUYER_STAKED: 1, 
  ACTIVE: 2,
  RELEASED: 3,
  COMPLETED: 4,
  CANCELLED: 5
} as const;

// Contract ABI
export const CONTRACT_ABI = [
  "function createListing(uint256 _price, string memory _itemName, string memory _itemDescription, string memory _category) external",
  "function getMetadata(uint256 _tradeId) external view returns (tuple(string itemName, string itemDescription, string category))",
  "function tradeMetadata(uint256) external view returns (string itemName, string itemDescription, string category)",
  "function trades(uint256) external view returns (uint256 tradeId, address seller, address buyer, uint256 price, uint256 sellerStake, uint256 buyerStake, uint256 activationTime, uint8 state)",
  "function tradeCounter() external view returns (uint256)",
  "function buyerDeposit(uint256 _tradeId) external payable",
  "function sellerDeposit(uint256 _tradeId) external payable",
  "function markItemReleased(uint256 _tradeId) external",
  "function confirmDelivery(uint256 _tradeId) external",
  "function emergencyWithdrawBuyer(uint256 _tradeId) external",
  "function refundTimeout(uint256 _tradeId) external",
  "event ListingCreated(uint256 indexed tradeId, address seller, uint256 price, string itemName, string category)",
  "event BuyerStaked(uint256 indexed tradeId, address buyer, uint256 amount)",
  "event Active(uint256 indexed tradeId, uint256 timestamp)",
  "event ItemReleased(uint256 indexed tradeId)",
  "event TradeCompleted(uint256 indexed tradeId)",
  "event Refunded(uint256 indexed tradeId, string reason)"
];

// IPFS Gateway URLs
export const IPFS_GATEWAYS = [
  "https://gateway.pinata.cloud/ipfs/",
  "https://ipfs.io/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/"
];