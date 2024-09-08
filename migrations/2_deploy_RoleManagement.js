const RoleManagement = artifacts.require("RoleManagement");

module.exports = async function (deployer) {
  // Asume que UserManagement ya fue desplegado
  await deployer.deploy(RoleManagement);
  const roleManagement = await RoleManagement.deployed();
  console.log("RoleManagement deployed at:", roleManagement.address);
};
