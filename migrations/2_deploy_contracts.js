const CourseEnrollment = artifacts.require("CourseEnrollment");

module.exports = function(deployer) {
    deployer.deploy(CourseEnrollment);
};