import { HardhatUserConfig } from "hardhat/config";
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

const fs = require('fs');
const privateKey = fs.readFileSync('.secret').toString();

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    // local node
    hardhat: {
      chainId: 1337,
    },
    // test net
    mumbai: {
      url: `https://rpc-mumbai.polygon.technology/`,
      accounts: [privateKey],
    },
    // main net
    matic: {
      url: `https://polygon-rpc.com`,
      accounts: [privateKey],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
