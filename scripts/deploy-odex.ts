import hre from "hardhat";

async function main() {
  console.log("Deploying Odex contract...");

  // Deploy the contract
  const Odex = await hre.ethers.getContractFactory("Odex");
  const odex = await Odex.deploy();

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