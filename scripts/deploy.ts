import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying Odex contract...");

  const connection = await hre.network.connect();
  const [deployer] = await connection.provider.request({ method: "eth_accounts" }) as string[];
  
  console.log("Deploying with account:", deployer);

  const balance = await connection.provider.request({ 
    method: "eth_getBalance", 
    params: [deployer, "latest"] 
  }) as string;
  console.log("Account balance:", ethers.formatEther(BigInt(balance)), "ETH");

  // Get contract artifact
  const artifact = await hre.artifacts.readArtifact("Odex");
  
  // Create provider and wallet
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  let privateKey = process.env.PRIVATE_KEY || "";
  if (!privateKey.startsWith("0x")) {
    privateKey = `0x${privateKey}`;
  }
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log("Wallet address:", wallet.address);

  // Deploy contract
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const odex = await factory.deploy();

  await odex.waitForDeployment();

  const contractAddress = await odex.getAddress();
  console.log("Odex deployed to:", contractAddress);

  // Update .env file with contract address
  const envPath = path.join(__dirname, "../.env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  const envVarName = "ODEX_CONTRACT_ADDRESS";
  const newEnvLine = `${envVarName}=${contractAddress}`;

  if (envContent.includes(envVarName)) {
    const regex = new RegExp(`${envVarName}=.*`, "g");
    envContent = envContent.replace(regex, newEnvLine);
  } else {
    if (envContent && !envContent.endsWith("\n")) {
      envContent += "\n";
    }
    envContent += newEnvLine + "\n";
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`Updated .env with ${envVarName}=${contractAddress}`);

  return contractAddress;
}

main()
  .then((address) => {
    console.log("Deployment successful! Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
