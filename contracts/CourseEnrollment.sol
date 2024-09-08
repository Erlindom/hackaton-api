// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CourseEnrollment is ERC721, Ownable{
    struct Course {
        uint id;
        string name;
        string description;
        string category;
        uint price;
        uint seats;
        bool isActive;
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

    struct Professor {
        address professorAddress;
        bool isProfessor;
    }

    struct Admin {
        address adminAddress;
        bool isAdmin;
    }

    struct User {
        string nombre;
        uint edad;
        string correo;
        string rol;
    }


    uint public courseCount = 0;
    uint public certificateTokenId = 0;


    mapping(address => User) private users;
    mapping(uint => Course) public courses;
    mapping(uint => mapping(address => Student)) public enrolledStudents;
    mapping(address => Professor) public professors;
    mapping(address => Admin) public admins;
    mapping(uint => Certificate) public certificates;

    event UserAdded(address indexed usuario, string nombre, uint edad, string correo, string rol);
    event CourseCreated(uint courseId, string courseName, uint price, uint seats);
    event StudentEnrolled(uint courseId, address student);
    event CertificateIssued(address student, uint tokenId);
    event ProfessorAdded(address professorAddress);
    event AdminAdded(address adminAddress);

    constructor() ERC721("CourseCertificate", "CCERT") Ownable(msg.sender){
    }

    function asignRoleToUser(string memory _role) public {
        bytes32 roleHash = keccak256(abi.encodePacked(_role));
        if (roleHash == keccak256(abi.encodePacked("Professor"))) {
            professors[msg.sender] = Professor(msg.sender, true);
        } else if (roleHash == keccak256(abi.encodePacked("Admin"))) {
            admins[msg.sender] = Admin(msg.sender, true);
        } else {
            revert("Rol no valido.");
        }
    }

    function deleteAdminOrProfessor(string memory _role) public {
        removeUser();
        bytes32 roleHash = keccak256(abi.encodePacked(_role));
        if (roleHash == keccak256(abi.encodePacked("Professor"))) {
            require (professors[msg.sender].isProfessor, "No es un profesor.");
            delete professors[msg.sender];
        } else if (roleHash == keccak256(abi.encodePacked("Admin"))) {
            require (admins[msg.sender].isAdmin, "No es un admin.");
            delete admins[msg.sender];
        } else {
            revert("Rol no valido.");
        }
    }


    // Crear un nuevo curso
    function createCourse(string memory _name, string memory _description, string memory _category, uint _price, uint _seats) public onlyOwner {
        require(_price > 0, "El precio debe ser mayor que cero");
        require(_seats > 0, "El numero de asientos debe ser mayor que cero");
        courses[courseCount] = Course(courseCount, _name, _description, _category, _price, _seats, true);
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
        certificates[certificateTokenId] = Certificate(certificateTokenId, _student);

        emit CertificateIssued(_student, certificateTokenId);
        certificateTokenId++;
    }

    // Agregar un nuevo profesor
    function addProfessor(address _professorAddress) public onlyOwner {
        professors[_professorAddress] = Professor(_professorAddress, true);
        emit ProfessorAdded(_professorAddress);
    }

    // Agregar un nuevo administrador
    function addAdmin(address _adminAddress) public onlyOwner {
        admins[_adminAddress] = Admin(_adminAddress, true);
        emit AdminAdded(_adminAddress);
    }

    // Modificar la información de un profesor
    function updateProfessor(address _professorAddress, bool _isProfessor) public onlyOwner {
        require(professors[_professorAddress].professorAddress == _professorAddress, "Profesor no existe.");
        professors[_professorAddress].isProfessor = _isProfessor;
    }

    // Modificar la información de un administrador
    function updateAdmin(address _adminAddress, bool _isAdmin) public onlyOwner {
        require(admins[_adminAddress].adminAddress == _adminAddress, "Administrador no existe.");
        admins[_adminAddress].isAdmin = _isAdmin;
    }

    // Retirar fondos del contrato (solo el propietario)
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function removeCourse(uint _idCourse) public {
        require (courses[_idCourse].isActive, "El curso no esta activo.");
        delete courses[_idCourse];
    }

    function removeStudentFromCourse(uint _courseId, address _student) public {
        require(enrolledStudents[_courseId][_student].isEnrolled, "El estudiante no esta inscrito.");
        delete enrolledStudents[_courseId][_student];
    }


    function addUser(string memory _nombre, uint _edad, string memory _correo, string memory _role) public {

        // Verifica si el usuario ya existe
        if (bytes(users[msg.sender].nombre).length != 0) {
            revert("El usuario ya existe");
        }

        // Verifica si el rol es válido
        bytes32 rolHash = keccak256(abi.encodePacked(_role));
        if (rolHash != keccak256(abi.encodePacked("Admin")) &&
            rolHash != keccak256(abi.encodePacked("Professor")) &&
            rolHash != keccak256(abi.encodePacked("Student"))) {
            revert("El rol no es valido");
        }
        if (bytes(users[msg.sender].rol).length != 0) {
            asignRoleToUser(users[msg.sender].rol);
        }

        // Agrega el usuario al mapeo usando la dirección del remitente como clave
        
        users[msg.sender] = User(_nombre, _edad, _correo, _role);
        
        // Emitir un evento para notificar que se ha agregado un nuevo usuario
        emit UserAdded(msg.sender, _nombre, _edad, _correo, _role);
    }
    
    // Función para obtener la información de un usuario
    function obtenerUsuario(address _usuario) public view returns (string memory nombre, uint edad, string memory correo) {
        User storage user = users[_usuario];
        return (user.nombre, user.edad, user.correo);
    }

    function removeUser() public {
        if (bytes(users[msg.sender].rol).length != 0) {
            deleteAdminOrProfessor(users[msg.sender].rol);
        }
        delete users[msg.sender];
    }

}