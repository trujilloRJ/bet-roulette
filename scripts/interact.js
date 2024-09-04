require("dotenv").config();
const { ethers, JsonRpcProvider } = require("ethers");

const contract = require("../artifacts/contracts/JavierToken.sol/JavierToken.json");
const API_URL = process.env.API_URL_LOCALHOST;
const PRIVATE_KEY = process.env.PRIVATE_KEY_DEV_LOCALHOST;
const CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDR_LOCALHOST;

// Provider
const provider = new JsonRpcProvider(API_URL);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract
const javierToken = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  const totalSupply = await javierToken.totalSupply();
  console.log("Total supply of JTR is: " + totalSupply);
}

main();
