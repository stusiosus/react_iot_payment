// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract UsernameRegistry {
    mapping(address => string) private usernames;
    event UsernameCreated(address indexed user, string username);
    event UsernameUpdated(address indexed user, string newUsername);


    function createUsername(string memory username) external {
        require(bytes(usernames[msg.sender]).length == 0, "Username already exists");
        require(bytes(username).length > 0, "Username cannot be empty");

        usernames[msg.sender] = username;
        emit UsernameCreated(msg.sender, username);
    }

    function updateUsername(string memory newUsername) external {
        require(bytes(usernames[msg.sender]).length > 0, "Username does not exist");
        require(bytes(newUsername).length > 0, "New username cannot be empty");

        usernames[msg.sender] = newUsername;
        emit UsernameUpdated(msg.sender, newUsername);
    }

    function getUsername(address user) external view returns (string memory) {
        return usernames[user];
    }
}
