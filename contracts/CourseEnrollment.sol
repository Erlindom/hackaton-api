// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CourseManagement is ERC721, Ownable {
    struct Course {
        uint id;
        string name;
        string description;
        string category;
        uint price;
        bool isActive;
        string courseImg;
        string courseVid; 
    }

    struct Student {
        address studentAddress;
        bool isEnrolled;
        bool isCertified;
    }

    struct Certificate {
        uint tokenId;
        address studentAddress;
    }

    uint public courseCount = 0;
    uint public certificateTokenId = 0;


    mapping(uint => Course) public courses;
    mapping(uint => mapping(address => Student)) public enrolledStudents;
    mapping(uint => Certificate) public certificates;

    event CourseCreated(uint courseId, string courseName, uint price);
    event StudentEnrolled(uint courseId, address student);
    event CourseRemoved(uint courseId);
    event CourseUpdated(uint courseId, string courseName, uint price);
    event CertificateIssued(address student, uint tokenId);
    event CertificateUpdated(uint tokenId, address student);

    constructor() ERC721("CourseCertificate", "CCERT") Ownable(msg.sender) {}

    function createCourse(string memory _name, string memory _description, string memory _category, uint _price, string memory _img, string memory _vid) public onlyOwner {
        require(_price > 0, "El precio debe ser mayor que cero");
        courses[courseCount] = Course(courseCount, _name, _description, _category, _price, true, _img, _vid);
        emit CourseCreated(courseCount, _name, _price);
        courseCount++;
    }

    function enroll(uint _courseId) public payable {
        Course memory course = courses[_courseId];
        require(course.isActive, "El curso no esta activo.");
        require(msg.value == course.price, "Pago incorrecto.");
        require(!enrolledStudents[_courseId][msg.sender].isEnrolled, "Ya esta inscrito.");

        enrolledStudents[_courseId][msg.sender] = Student(msg.sender, true, false);
        emit StudentEnrolled(_courseId, msg.sender);
    }

    function removeCourse(uint _courseId) public onlyOwner {
        courses[_courseId].isActive = false;
        emit CourseRemoved(_courseId);
    }

    function issueCertificate(uint _courseId, address _student) public onlyOwner {
        require(enrolledStudents[_courseId][_student].isEnrolled, "El estudiante no esta inscrito");
        require(!enrolledStudents[_courseId][_student].isCertified, "Certificado ya emitido.");
        _safeMint(_student, certificateTokenId);
        enrolledStudents[_courseId][_student].isCertified = true;
        certificates[certificateTokenId] = Certificate(certificateTokenId, _student);
        emit CertificateIssued(_student, certificateTokenId);
        certificateTokenId++;
    }
}