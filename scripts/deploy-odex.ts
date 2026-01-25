import hre from "hardhat";
import { ethers } from "ethers";

async function main() {
  console.log("Deploying Odex contract...");

  // Get contract artifact
  const artifact = await hre.artifacts.readArtifact("Odex");
  
  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  let privateKey = process.env.PRIVATE_KEY || "";
  if (!privateKey.startsWith("0x")) {
    privateKey = `0x${privateKey}`;
  }
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Deploying with wallet:", wallet.address);

  // Deploy contract
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const odex = await factory.deploy();

  await odex.waitForDeployment();

  const contractAddress = await odex.getAddress();
  console.log("Odex deployed to:", contractAddress);

  // Verify the contract on the blockchain explorer (optional)
  console.log("Contract deployment completed!");
  console.log(`Add this to your .env file:`);
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);

  return contractAddress;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});