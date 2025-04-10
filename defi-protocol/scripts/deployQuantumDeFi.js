const hre = require("hardhat");

async function main() {
  // Contract addresses - replace with actual addresses
  const stablecoinAddress = "0xYourStablecoinAddress";
  const priceFeedAddress = "0xYourPriceFeedAddress";
  const flashLoanPoolAddress = "0xYourFlashLoanPoolAddress";

  const QuantumDeFiProtocol = await hre.ethers.getContractFactory("QuantumDeFiProtocol");
  const quantumDeFi = await QuantumDeFiProtocol.deploy(
    stablecoinAddress,
    priceFeedAddress,
    flashLoanPoolAddress
  );

  await quantumDeFi.deployed();

  console.log("QuantumDeFiProtocol deployed to:", quantumDeFi.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
