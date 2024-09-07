// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CourseEnrollment is ERC721, Ownable{
    struct Course {
        uint id;
        string name;
        uint price;
        uint seats;
        bool isActive;
    }

    struct Student {
        address studentAddress;
        bool isEnrolled;
        bool isCertified;
    }

    uint public courseCount = 0;
    uint public certificateTokenId;

    mapping(uint => Course) public courses;
    mapping(uint => mapping(address => Student)) public enrolledStudents;

    event CourseCreated(uint courseId, string courseName, uint price, uint seats);
    event StudentEnrolled(uint courseId, address student);
    event CertificateIssued(address student, uint tokenId);

    constructor() ERC721("CourseCertificate", "CCERT") Ownable(msg.sender){}


    // Crear un nuevo curso
    function createCourse(string memory _name, uint _price, uint _seats) public onlyOwner {
        require(_price > 0, "El precio debe ser mayor que cero");
        require(_seats > 0, "El numero de asientos debe ser mayor que cero");
        courses[courseCount] = Course(courseCount, _name, _price, _seats, true);
        courseCount++;
        emit CourseCreated(courseCount, _name, _price, _seats);
    }

    // Inscripción de estudiantes
    function enroll(uint _courseId) public payable {
        Course memory course = courses[_courseId];
        require(course.isActive, "El curso no esta activo.");
        require(msg.value == course.price, "Pago incorrecto.");
        require(enrolledStudents[_courseId][msg.sender].isEnrolled == false, "Ya esta inscrito.");
        require(course.seats > 0, "No hay cupos disponibles.");

        enrolledStudents[_courseId][msg.sender] = Student(msg.sender, true, false);
        courses[_courseId].seats -= 1;

        emit StudentEnrolled(_courseId, msg.sender);
    }

    // Emitir certificado al completar el curso
    function issueCertificate(uint _courseId, address _student) public onlyOwner {
        require(enrolledStudents[_courseId][_student].isEnrolled, "El estudiante no esta inscrito.");
        require(enrolledStudents[_courseId][_student].isCertified == false, "Certificado ya emitido.");

        // Emitir el NFT como certificado
        _safeMint(_student, certificateTokenId);
        enrolledStudents[_courseId][_student].isCertified = true;

        emit CertificateIssued(_student, certificateTokenId);
        certificateTokenId++;
    }

    // Retirar fondos del contrato (solo el propietario)
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}