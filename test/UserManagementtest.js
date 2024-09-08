const UserManagement = artifacts.require("UserManagement");
const truffleAssert = require("truffle-assertions");

contract("UserManagement", (accounts) => {
  let userManagement;

  before(async () => {
    userManagement = await UserManagement.deployed();
  });

  it("should add an user successfully", async () => {
    await userManagement.addUser("Alice", 25, "alice@example.com", "Student", { from: accounts[0] });
    const user = await userManagement.obtenerUsuario(accounts[0]);

    assert(user[0] === "Alice", "El nombre del usuario es incorrecto");
    assert(user[1].toNumber() === 25, "La edad del usuario es incorrecta");
    assert(user[2] === "alice@example.com", "El correo del usuario es incorrecto");
    assert(user[3] === "Student", "El rol del usuario es incorrecto");
  });

  it("should revert when adding a user that already exists", async () => {
    await userManagement.addUser("Bob", 30, "bob@example.com", "Admin", { from: accounts[1] });
    await truffleAssert.reverts(
      userManagement.addUser("Bob", 30, "bob@example.com", "Admin", { from: accounts[1] }),
      "El usuario ya existe"
    );
  });

  it("should remove an existing user", async () => {
    await userManagement.addUser("Charlie", 22, "charlie@example.com", "Student", { from: accounts[2] });
    await userManagement.removeUser({ from: accounts[2] });
    const user = await userManagement.obtenerUsuario(accounts[2]);
    assert(user[0] === "", "El usuario no ha sido eliminado correctamente");
  });

  it("should revert when trying to remove a non-existent user", async () => {
    await truffleAssert.reverts(
      userManagement.removeUser({ from: accounts[3] }),
      "El usuario no existe"
    );
  });
});
