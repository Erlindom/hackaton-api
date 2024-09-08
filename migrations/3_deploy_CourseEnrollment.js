const CourseManagement = artifacts.require("CourseEnrollment");

module.exports = async function (deployer) {
  await deployer.deploy(CourseManagement);
};
