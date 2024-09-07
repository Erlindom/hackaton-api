const CourseEnrollment = artifacts.require("CourseEnrollment");

module.exports = function(deployer) {
    // Argumentos del constructor: dirección del propietario, nombre del token, símbolo del token
    deployer.deploy(CourseEnrollment);
};