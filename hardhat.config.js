require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
	solidity: { version: "0.7.6", settings: { optimizer: { enabled: true, runs: 200 } }},
	paths: {
		artifacts: "./src/artifacts",
	},
	networks: {
		hardhat: {
			chainId: 1337,
		},
		polygon_mumbai: {
			url: `https://polygon-mumbai.g.alchemy.com/v2/VU5Z6_VJgdMUgrcfhGsHk2o5tzEfFbhT`,
			accounts: [process.env.PVT_KEY],
			allowUnlimitedContractSize: true,
		},
	},
};