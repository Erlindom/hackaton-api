const CourseEnrollment = artifacts.require("CourseEnrollment");
const truffleAssert = require("truffle-assertions");

contract("CourseEnrollment", (accounts) => {
  let courseEnrollment;

  before(async () => {
    courseEnrollment = await CourseEnrollment.deployed();
  });

  it("should allow the owner to create a course", async () => {
    await courseEnrollment.createCourse(
      "Blockchain Basics",
      "Introduction to Blockchain",
      "Technology",
      web3.utils.toWei("1", "ether"),
      "img_url",
      "vid_url",
      { from: accounts[0] }
    );

    const course = await courseEnrollment.courses(0);

    assert(course.name === "Blockchain Basics", "El nombre del curso es incorrecto");
    assert(course.price.toString() === web3.utils.toWei("1", "ether"), "El precio del curso es incorrecto");
  });

  it("should allow a student to enroll in a course", async () => {
    await courseEnrollment.enroll(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") });
    const student = await courseEnrollment.enrolledStudents(0, accounts[1]);

    assert(student.isEnrolled === true, "El estudiante no se ha inscrito correctamente");
  });

  it("should revert when enrolling with insufficient funds", async () => {
    await truffleAssert.reverts(
      courseEnrollment.enroll(0, { from: accounts[2], value: web3.utils.toWei("0.5", "ether") }),
      "Pago incorrecto."
    );
  });

  it("should remove a course", async () => {
    await courseEnrollment.removeCourse(0, { from: accounts[0] });
    const course = await courseEnrollment.courses(0);

    assert(course.name === "", "El curso no ha sido eliminado correctamente");
  });

  it("should not allow enrollment in a deleted course", async () => {
    await truffleAssert.reverts(
      courseEnrollment.enroll(0, { from: accounts[1], value: web3.utils.toWei("1", "ether") }),
      "El curso no esta activo."
    );
  });

  it("should allow the owner to create a new course", async () => {
    await courseEnrollment.createCourse(
      "NFT 101",
      "Introduction to NFTs",
      "Digital Art",
      web3.utils.toWei("1", "ether"),
      "img_url",
      "vid_url",
      { from: accounts[0] }
    );

    const course = await courseEnrollment.courses(1);
    
    assert(course.name === "NFT 101", "El nombre del curso es incorrecto");
    assert(course.price.toString() === web3.utils.toWei("1", "ether"), "El precio del curso es incorrecto");
  });


  it("should issue a certificate to an enrolled student", async () => {
    await courseEnrollment.createCourse(
      "NFT 101",
      "Introduction to NFTs",
      "Digital Art",
      web3.utils.toWei("1", "ether"),
      "img_url",
      "vid_url",
      { from: accounts[0] }
    );

    await courseEnrollment.enroll(2, { from: accounts[1], value: web3.utils.toWei("1", "ether") });

    // Emite un certificado
    await courseEnrollment.issueCertificate(2, accounts[1], { from: accounts[0] });

    const certificate = await courseEnrollment.certificates(0);
    assert(certificate.studentAddress === accounts[1], "El certificado no fue emitido al estudiante correcto");
  });

  it("should verify that a student has been certified", async () => {
    const isCertified = await courseEnrollment.certificates(0);
    assert(isCertified.studentAddress === accounts[1], "El estudiante no ha sido certificado");
  });


  it("should revert when issuing a certificate to a non-enrolled student", async () => {
    await truffleAssert.reverts(
      courseEnrollment.issueCertificate(1, accounts[3], { from: accounts[0] }),
      "El estudiante no esta inscrito"
    );
  });

  it("should not issue a certificate twice to the same student", async () => {
    await truffleAssert.reverts(
      courseEnrollment.issueCertificate(2, accounts[1], { from: accounts[0] }),
      "Certificado ya emitido."
    );
  });
});
