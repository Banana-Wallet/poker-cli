import { ethers } from "hardhat";

async function deployPokerGame() {

  const pokerGameSingleton = await ethers.deployContract("PokerGameSingleton");
  await pokerGameSingleton.waitForDeployment();
  console.log("Poker Game Singleton deployed to:", pokerGameSingleton.target);

  const pokerGameProxyFactory = await ethers.deployContract("PokerGameProxyFactory");
  await pokerGameProxyFactory.waitForDeployment();

  console.log("Poker Game Proxy Factory deployed to:", pokerGameProxyFactory.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployPokerGame().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
