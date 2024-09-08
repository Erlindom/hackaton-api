// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract UserManagement {
    struct User {
        string nombre;
        uint edad;
        string correo;
        string rol;
    }

    mapping(address => User) public users;

    event UserAdded(address indexed usuario, string nombre, uint edad, string correo, string rol);
    event UserRemoved(address indexed usuario);

    function addUser(string memory _nombre, uint _edad, string memory _correo, string memory _rol) public {
        require(bytes(users[msg.sender].nombre).length == 0, "El usuario ya existe");
        users[msg.sender] = User(_nombre, _edad, _correo, _rol);
        emit UserAdded(msg.sender, _nombre, _edad, _correo, _rol);
    }

    function removeUser() public {
        require(bytes(users[msg.sender].nombre).length != 0, "El usuario no existe");
        delete users[msg.sender];
        emit UserRemoved(msg.sender);
    }

    function obtenerUsuario(address _usuario) public view returns (string memory, uint, string memory, string memory) {
        User storage user = users[_usuario];
        return (user.nombre, user.edad, user.correo, user.rol);
    }
}
