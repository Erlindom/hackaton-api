const CourseEnrollment = artifacts.require("CourseEnrollment");

module.exports = function(deployer) {
    // Argumentos del constructor: dirección del propietario, nombre del token, símbolo del token
    const initialOwner = "0x1234567890abcdef1234567890abcdef12345678"; // Reemplaza con la dirección deseada
    deployer.deploy(CourseEnrollment, initialOwner);
};