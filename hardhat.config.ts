import { HardhatUserConfig } from "hardhat/config";
import dotenv from 'dotenv';
import "@nomicfoundation/hardhat-toolbox";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    polygonzkevm: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/cNkdRWeB8oylSQJSA2V3Xev2PYh5YGr4',
      accounts:[`${process.env.PRIVATE_KEY}`]
    },
    anvil: {
      url: 'http://127.0.0.1:8545',
      accounts: [`${process.env.PRIVATE_KEY}`],
      chainId: 31337
    }
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  }
};

export default config;
