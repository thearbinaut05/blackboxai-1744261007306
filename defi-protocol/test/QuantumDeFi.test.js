const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuantumDeFiProtocol", function() {
  let QuantumDeFiProtocol;
  let quantumDeFi;
  let owner, trader;

  beforeEach(async function() {
    [owner, trader] = await ethers.getSigners();

    // Mock contracts
    const MockStablecoin = await ethers.getContractFactory("MockStablecoin");
    const mockStablecoin = await MockStablecoin.deploy();
    
    const MockPriceFeed = await ethers.getContractFactory("MockPriceFeed");
    const mockPriceFeed = await MockPriceFeed.deploy();
    
    const MockFlashLoanPool = await ethers.getContractFactory("MockFlashLoanPool");
    const mockFlashLoanPool = await MockFlashLoanPool.deploy();

    QuantumDeFiProtocol = await ethers.getContractFactory("QuantumDeFiProtocol");
    quantumDeFi = await QuantumDeFiProtocol.deploy(
      mockStablecoin.address,
      mockPriceFeed.address,
      mockFlashLoanPool.address
    );
  });

  it("Should open a position with leverage", async function() {
    await quantumDeFi.connect(trader).openPosition(ethers.utils.parseEther("1000"), 5);
    const position = await quantumDeFi.positions(trader.address);
    
    expect(position.principal).to.equal(ethers.utils.parseEther("1000"));
    expect(position.leverage).to.equal(5);
  });

  it("Should rebalance position after interval", async function() {
    await quantumDeFi.connect(trader).openPosition(ethers.utils.parseEther("1000"), 5);
    
    // Fast forward time
    await ethers.provider.send("evm_increaseTime", [3601]); // 1 hour + 1 second
    await ethers.provider.send("evm_mine");
    
    await quantumDeFi.connect(trader).rebalancePosition();
    const position = await quantumDeFi.positions(trader.address);
    
    expect(position.lastRebalance).to.be.gt(0);
  });

  it("Should calculate Fibonacci sequence", async function() {
    await quantumDeFi.connect(trader).openPosition(ethers.utils.parseEther("1000"), 5);
    
    // Initial sequence should be 1
    let position = await quantumDeFi.positions(trader.address);
    expect(position.fibSequence).to.equal(1);
    
    // First rebalance should update to next Fibonacci number
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");
    await quantumDeFi.connect(trader).rebalancePosition();
    
    position = await quantumDeFi.positions(trader.address);
    expect(position.fibSequence).to.equal(1);
    
    // Second rebalance
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");
    await quantumDeFi.connect(trader).rebalancePosition();
    
    position = await quantumDeFi.positions(trader.address);
    expect(position.fibSequence).to.equal(2);
  });

  it("Should capture MEV profit", async function() {
    await quantumDeFi.connect(trader).captureMEV();
    const profit = await quantumDeFi.compoundedProfits(trader.address);
    
    expect(profit).to.be.gt(0);
  });
});
