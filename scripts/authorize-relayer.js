const hre = require("hardhat");

async function main() {
  const tokenAddress = process.argv[2];
  const relayerAddress = process.argv[3] || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  if (!tokenAddress) {
    console.error("Usage: npx hardhat run scripts/authorize-relayer.js --network localhost <TOKEN_ADDRESS>");
    process.exit(1);
  }

  console.log(`Authorizing relayer ${relayerAddress} on token ${tokenAddress}...`);

  const token = await hre.ethers.getContractAt("CompliantToken", tokenAddress);
  
  const tx = await token.addAuthorizedVerifier(relayerAddress);
  await tx.wait();

  console.log("✅ Relayer authorized successfully!");
  console.log(`Transaction: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
