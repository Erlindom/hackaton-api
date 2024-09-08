const RoleManagement = artifacts.require("RoleManagement");
const truffleAssert = require("truffle-assertions");

contract("RoleManagement", (accounts) => {
  let roleManagement;

  before(async () => {
    roleManagement = await RoleManagement.deployed();
  });

  it("should assign a professor role successfully", async () => {
    await roleManagement.addUser("Professor X", 45, "professor@example.com", "Professor", { from: accounts[0] });
    await roleManagement.asignRoleToUser("Professor", { from: accounts[0] });

    const professor = await roleManagement.professors(accounts[0]);
    assert(professor.isProfessor === true, "El usuario no fue asignado correctamente como profesor");
  });

  it("should revert when assigning an invalid role", async () => {
    await truffleAssert.reverts(
      roleManagement.asignRoleToUser("InvalidRole", { from: accounts[1] }),
      "Rol no valido."
    );
  });

  it("should delete an existing professor", async () => {
    await roleManagement.addUser("Professor Y", 45, "prof@example.com", "Professor", { from: accounts[2] });
    await roleManagement.asignRoleToUser("Professor", { from: accounts[2] });

    const professor1 = await roleManagement.professors(accounts[2]);
    assert(professor1.isProfessor === true, "El usuario no fue asignado correctamente como profesor");

    await roleManagement.deleteAdminOrProfessor("Professor", { from: accounts[2] });

    const professor = await roleManagement.professors(accounts[2]);
    assert(professor.isProfessor === false, "El profesor no fue eliminado correctamente");
  });

    it("should revert when trying to delete a non-existent professor", async () => {
        await truffleAssert.reverts(
        roleManagement.deleteAdminOrProfessor("Professor", { from: accounts[3] }),
        "No es un profesor."
        );
    });

    it("should assign an admin role successfully", async () => {
        await roleManagement.addUser("Admin", 45, "admin@example.com", "Admin", { from: accounts[3] });
        await roleManagement.asignRoleToUser("Admin", { from: accounts[3] });

        const admin = await roleManagement.admins(accounts[3]);
        assert(admin.isAdmin === true, "El usuario no fue asignado correctamente como administrador");
    });

    it("should delete an existing admin", async () => {
        await roleManagement.asignRoleToUser("Admin", { from: accounts[2] });
        await roleManagement.deleteAdminOrProfessor("Admin", { from: accounts[2] });

        const admin = await roleManagement.admins(accounts[2]);
        assert(admin.isAdmin === false, "El administrador no fue eliminado correctamente");
    });
});
