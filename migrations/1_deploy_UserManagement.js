const UserManagement = artifacts.require("UserManagement");

module.exports = async function (deployer) {
  await deployer.deploy(UserManagement);
  const userManagement = await UserManagement.deployed();
  console.log("UserManagement deployed at:", userManagement.address);
};
