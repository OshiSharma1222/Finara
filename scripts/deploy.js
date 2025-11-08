const hre = require("hardhat");

async function main() {
  console.log("Deploying Finara contracts to Sepolia...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy BankFactory
  const BankFactory = await hre.ethers.getContractFactory("BankFactory");
  const factory = await BankFactory.deploy();
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  
  console.log("BankFactory deployed to:", factoryAddress);

  // Save deployment addresses
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    factoryAddress: factoryAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address
  };

  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments");
  }

  fs.writeFileSync(
    `deployments/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment complete!");
  console.log("Factory Address:", factoryAddress);
  console.log("\nYou can now use this factory address in your backend .env file");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

