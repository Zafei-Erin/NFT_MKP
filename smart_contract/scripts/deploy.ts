// to deploy on local node:
// run "npx hardhat node"
// run "npx hardhat run scripts/deploy.ts --network localhost"

// to deploy on test net:
// run "npx hardhat run scripts/deploy.ts --network mumbai"
const hre = require("hardhat");

async function main() {
  let txHash, txReceipt;
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarketPlace");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();

  txHash = nftMarket.deployTransaction.hash;
  txReceipt = await hre.ethers.provider.waitForTransaction(txHash);
  const nftMarketAddress = txReceipt.contractAddress;

  console.log("nftMarket deployed to:", nftMarketAddress);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();

  txHash = nft.deployTransaction.hash;
  txReceipt = await hre.ethers.provider.waitForTransaction(txHash);
  const nftAddress = txReceipt.contractAddress
  console.log("nft deployed to:", nftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
