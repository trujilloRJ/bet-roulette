const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("JavierToken contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const initialSupply = ethers.parseEther("1000");
    const initialOwnerBalance = ethers.parseEther("500");
    const initialContractBalance = ethers.parseEther("500");
    const initialAllowance = ethers.parseEther("5");

    const hardhatToken = await ethers.deployContract("JavierToken");

    // Fixtures can return anything you consider useful for your tests
    return {
      hardhatToken,
      owner,
      addr1,
      addr2,
      initialSupply,
      initialOwnerBalance,
      initialAllowance,
      initialContractBalance,
    };
  }

  it("Deployment should assign the half of the total supply to owner and half to contract", async function () {
    const {
      hardhatToken,
      owner,
      initialOwnerBalance,
      initialSupply,
      initialContractBalance,
    } = await loadFixture(deployTokenFixture);

    expect(await hardhatToken.balanceOf(owner.address)).to.equal(
      initialOwnerBalance
    );

    expect(await hardhatToken.getContractFunds()).to.equal(
      initialContractBalance
    );

    expect(await hardhatToken.totalSupply()).to.equal(initialSupply);
  });
  it("Initial mint for new members should return initial supply only once", async function () {
    const { hardhatToken, addr1, initialAllowance } = await loadFixture(
      deployTokenFixture
    );

    await expect(hardhatToken.connect(addr1).mintForNewMember())
      .to.emit(hardhatToken, "AddNewMember")
      .withArgs(addr1);

    // after call balance of new member should be changed
    expect(await hardhatToken.balanceOf(addr1)).to.equal(initialAllowance);

    // TODO: uncomment after development
    // user already got initial allowance, so any subsequent tries should be reverted
    // await expect(hardhatToken.connect(addr1).mintForNewMember()).to.be.reverted;
  });

  describe("Betting system", function () {
    it("Set max random number only by owner", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );
      await hardhatToken.setMaxRandomNumber(10);

      expect(await hardhatToken.getMaxRandomNumber()).to.equal(10);
      await expect(hardhatToken.connect(addr1).setMaxRandomNumber(10)).to.be
        .reverted;
    });

    it("Check conditions for placing bet", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );

      await hardhatToken.connect(addr1).mintForNewMember();

      // user is betting more than he has, it should be reverted
      let betAmount = ethers.parseEther("11");
      await expect(hardhatToken.connect(addr1).playBet(1, betAmount)).to.be
        .reverted;

      // contract does not have enough funds to pay the reward, it should be reverted
      betAmount = ethers.parseEther("70"); // rewards should be 560, contract only has 500
      await expect(hardhatToken.playBet(1, betAmount)).to.be.reverted;
    });

    it("Test bet outcome and transactions", async function () {
      const { hardhatToken, owner, addr1 } = await loadFixture(
        deployTokenFixture
      );

      // this is to ensure deterministic results
      await hardhatToken.setMaxRandomNumber(1);

      // get tokens to start betting
      await hardhatToken.connect(addr1).mintForNewMember();

      // for sure, 1 will be the outcome, so user will win this bet
      // initial balance was 5 ETH and then it receives 8 ETH from winning
      // the bet, so the balance sould be 13 ETH
      let betAmount = ethers.parseEther("1");
      await hardhatToken.connect(addr1).playBet(1, betAmount);
      expect(await hardhatToken.balanceOf(addr1)).to.be.equal(
        ethers.parseEther("13")
      );

      // for sure, 1 will be the outcome, so user will lost this bet
      await hardhatToken.connect(addr1).playBet(2, betAmount);
      expect(await hardhatToken.balanceOf(addr1)).to.be.equal(
        ethers.parseEther("12")
      );

      // ensure it emits the right event
      await expect(hardhatToken.connect(addr1).playBet(2, betAmount))
        .to.emit(hardhatToken, "BetOutcome")
        .withArgs(addr1, 2, 1);
    });
  });
});
