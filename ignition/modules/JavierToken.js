const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const JavierTokenModule = buildModule("JavierTokenModule", (m) => {
  const token = m.contract("JavierToken");

  return { token };
});

module.exports = JavierTokenModule;
