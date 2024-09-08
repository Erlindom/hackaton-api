const CourseEnrollment = artifacts.require("CourseEnrollment");

const truffleAssert = require("truffle-assertions");

contract("CourseEnrollment", (accounts) => {
  let courseEnrollment;

  before(async () => {
    courseEnrollment = await CourseEnrollment.deployed();
  });

  it("should allow the owner to create a course", async () => {
    const courseEnrollment = await CourseEnrollment.deployed();

    // Crea un curso
    const courseEnroll = await courseEnrollment.createCourse("Solidity 101", "Solidity Tutorial", "Coding", web3.utils.toWei("1", "ether"), 10, { from: accounts[0] });

    // Obtiene el curso creado
    const course = await courseEnrollment.courses(0);

    // Verifica los atributos del curso
    assert(course.name === "Solidity 101");
  });

  it("should allow a student to enroll in a course", async () => {
    const courseEnrollment = await CourseEnrollment.deployed();
    await courseEnrollment.enroll(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") });
    const student = await courseEnrollment.enrolledStudents(0, accounts[1]);
    assert(student.isEnrolled === true);
  });

  it("should delete a course", async () => {
    const courseEnrollment = await CourseEnrollment.deployed();
    await courseEnrollment.removeCourse(0, { from: accounts[0] });
    const course = await courseEnrollment.courses(0);
    assert(course.name === "");
  });

  it("should not allow a student to enroll in a deleted course", async () => {
    const courseEnrollment = await CourseEnrollment.deployed();
    await truffleAssert.reverts(courseEnrollment.enroll(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") }), "El curso no esta activo.");
  });

  it("should not allow a student to enroll in a course with insufficient funds", async () => {
    const courseEnrollment = await CourseEnrollment.deployed();
    await courseEnrollment.createCourse("Solidity 101", "Solidity Tutorial", "Coding", web3.utils.toWei("1", "ether"), 10, { from: accounts[0] });
    await truffleAssert.reverts(courseEnrollment.enroll(1, { from: accounts[1], value: web3.utils.toWei("0.5", "ether") }), "Pago incorrecto.");
  });

  it("should add a user successfully", async () => {
    // Agrega un usuario
    await courseEnrollment.addUser("Juan", 30, "juan@example.com", "Admin", { from: accounts[1] });

    // Obtiene la información del usuario usando la función obtenerUsuario
    const user = await courseEnrollment.obtenerUsuario(accounts[1]);

    // Verifica que el usuario fue agregado correctamente
    assert(user[0] === "Juan", "El nombre del usuario es incorrecto");
    assert(user[1].toNumber() === 30, "La edad del usuario es incorrecta");
    assert(user[2] === "juan@example.com", "El correo del usuario es incorrecto");
  });

  it("should revert when adding a user that already exists", async () => {
    // Primero, agrega un usuario
    await courseEnrollment.addUser("Miguel", 30, "juan@example.com", "Admin", { from: accounts[2] });

    // Verifica que el usuario fue agregado correctamente
    const user = await courseEnrollment.obtenerUsuario(accounts[2]);
    assert(user[0] === "Miguel", "El nombre del usuario no es correcto");
    assert(user[1].toNumber() === 30, "La edad del usuario no es correcta");
    assert(user[2] === "juan@example.com", "El correo del usuario no es correcto");
    assert(user[3] === "Admin", "El rol del usuario no es correcto");

    // Luego, intenta agregar el mismo usuario nuevamente
    await truffleAssert.reverts(
        courseEnrollment.addUser("Miguel", 30, "juan@example.com", "Admin", { from: accounts[2] }),
        "El usuario ya existe"
    );

    const user2 = await courseEnrollment.obtenerUsuario(accounts[2]);
    assert(user2[0] === "Miguel", "El nombre del usuario no es correcto");
    assert(user2[1].toNumber() === 30, "La edad del usuario no es correcta");
    assert(user2[2] === "juan@example.com", "El correo del usuario no es correcto");
    assert(user2[3] === "Admin", "El rol del usuario no es correcto");
  });

  it("should revert when adding a user with an invalid role", async () => {
    await truffleAssert.reverts(
        courseEnrollment.addUser("Juan", 30, "juan@example.com", "InvalidRole", { from: accounts[3] }),
        "El rol no es valido"
    );
  });

  it("should remove an existing user", async () => {
    // Primero, agrega un usuario
    await courseEnrollment.addUser("Juan", 30, "juan@example.com", "Student", { from: accounts[4] });
    const userCreated = await courseEnrollment.obtenerUsuario(accounts[4]);
    assert(userCreated[0] === "Juan");
    // Luego, elimina el usuario
    await courseEnrollment.removeUser({ from: accounts[4] });
    const userDeleted = await courseEnrollment.obtenerUsuario(accounts[4]);
    assert(userDeleted[0] === "");
  });

  it("should remove an existing user", async () => {
    // Primero, agrega un usuario
    await courseEnrollment.addUser("Juan", 30, "juan@example.com", "Admin", { from: accounts[5] });
    
    // Verifica que el usuario fue agregado correctamente
    const userCreated = await courseEnrollment.obtenerUsuario(accounts[5]);
    assert(userCreated[0] === "Juan");
    assert(userCreated[3] === "Admin");

    // Verifica que el usuario es un admin (esto es para depuración)
    const adminCheck = await courseEnrollment.admins(accounts[5]);
    assert(adminCheck.isAdmin === true, "El usuario no está registrado como admin");

    // Luego, elimina el usuario
    await courseEnrollment.removeUser({ from: accounts[5] });

    // Verifica que el usuario haya sido eliminado
    const userDeleted = await courseEnrollment.obtenerUsuario(accounts[5]);
    assert(userDeleted[0] === "", "El usuario no ha sido eliminado correctamente");
  });


  it("should revert when trying to remove a non-existent user", async () => {
    // Intenta eliminar un usuario que no existe
    await truffleAssert.reverts(
        courseEnrollment.removeUser({ from: accounts[6] }),
        "El usuario no existe"
    );
  });
});