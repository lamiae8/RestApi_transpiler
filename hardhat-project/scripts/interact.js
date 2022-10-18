
const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// For Hardhat 
//const contract = require("../artifacts/contracts/HelloWorld.sol/HelloWorld.json");
const contract = require("../artifacts/contracts/test.sol/test.json");

console.log(JSON.stringify(contract.abi));
