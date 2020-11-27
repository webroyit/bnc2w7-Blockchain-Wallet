const Migrations = artifacts.require("Migrations");
const FakeDaiToken = artifacts.require("FakeDaiToken");

module.exports = async function (deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(FakeDaiToken);

  const tokenMock = await FakeDaiToken.deployed();

  // Mint 1,000 Dai Tokens for the deployer
  await tokenMock.mint(
    '0xD6bCe59fd0b6CFE88A22b46D3074703cB11595D2',
    '1000000000000000000000'
  );
};
