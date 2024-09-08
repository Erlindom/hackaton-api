const CourseEnrollment = artifacts.require("CourseEnrollment");

const truffleAssert = require("truffle-assertions");

contract("CourseEnrollment", (accounts) => {
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
});