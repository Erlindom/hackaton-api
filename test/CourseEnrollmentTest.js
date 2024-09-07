const CourseEnrollment = artifacts.require("CourseEnrollment");

contract("CourseEnrollment", (accounts) => {
  it("should allow the owner to create a course", async () => {
    const courseEnrollment = await CourseEnrollment.deployed();
    await courseEnrollment.createCourse("Solidity 101", web3.utils.toWei("1", "ether"), 10, { from: accounts[0] });
    const course = await courseEnrollment.courses(0);
    assert(course.name === "Solidity 101");
  });

  it("should allow a student to enroll in a course", async () => {
    const courseEnrollment = await CourseEnrollment.deployed();
    await courseEnrollment.enroll(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") });
    const student = await courseEnrollment.enrolledStudents(0, accounts[1]);
    assert(student.isEnrolled === true);
  });
});