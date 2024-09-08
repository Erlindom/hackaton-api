// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./UserManagement.sol";

contract RoleManagement is UserManagement {
    struct Professor {
        address professorAddress;
        bool isProfessor;
    }

    struct Admin {
        address adminAddress;
        bool isAdmin;
    }

    mapping(address => Professor) public professors;
    mapping(address => Admin) public admins;

    event ProfessorAdded(address indexed professorAddress);
    event AdminAdded(address indexed adminAddress);

    function asignRoleToUser(string memory _role) public {
        bytes32 roleHash = keccak256(abi.encodePacked(_role));
        if (roleHash == keccak256(abi.encodePacked("Professor"))) {
            // Comparar rol con un hash en lugar de un string
            professors[msg.sender] = Professor(msg.sender, true);
            emit ProfessorAdded(msg.sender);
        } else if (roleHash == keccak256(abi.encodePacked("Admin"))) {
            // Comparar rol con un hash en lugar de un string
            admins[msg.sender] = Admin(msg.sender, true);
            emit AdminAdded(msg.sender);
        } else if(roleHash == keccak256(abi.encodePacked("Student"))) {
            // Do nothing, Student is Base Role
        } else {
            revert("Rol no valido.");
        }
    }

    function deleteAdminOrProfessor(string memory _role) public {
        bytes32 roleHash = keccak256(abi.encodePacked(_role));
        if (roleHash == keccak256(abi.encodePacked("Professor"))) {
            require(professors[msg.sender].isProfessor, "No es un profesor.");
            delete professors[msg.sender];
        } else if (roleHash == keccak256(abi.encodePacked("Admin"))) {
            require(admins[msg.sender].isAdmin, "No es un admin");
            delete admins[msg.sender];
        } else {
            revert("Rol no valido.");
        }
    }
}
