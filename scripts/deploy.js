const hre = require("hardhat");

async function main() {
	const ETHVJTI1155 = await hre.ethers.getContractFactory("EthVJTI1155");
	const ETHVJTI1155Deployed = await ETHVJTI1155.deploy("EVT", "EthVJTI Token");

	await ETHVJTI1155Deployed.deployed();

	console.log(`Cvp deployed to ${ETHVJTI1155Deployed.address}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
