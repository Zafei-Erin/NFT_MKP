// to deploy on local node:
// run "npx hardhat node"
// run "npx hardhat run scripts/deploy.ts --network localhost"

// to deploy on test net:
// run "npx hardhat run scripts/deploy.ts --network mumbai"
const hre = require('hardhat');

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory('NFTMarketPlace');
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log('nftMarket deployed to:', nftMarket.address);

  const NFT = await hre.ethers.getContractFactory('NFT');
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log('nft deployed to:', nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
