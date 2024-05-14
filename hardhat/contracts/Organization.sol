// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Organization is ERC721 {
    uint256 public constant ADMIN_ROLE = 1;
    uint256 public constant USER_ROLE = 2;

    struct Device {
        string name;
    }

    struct Organization {
        address admin;
        mapping(address => uint256) userRoles; // Benutzeradressen zu Rollen (ADMIN_ROLE oder USER_ROLE)
        mapping(uint256 => Device) devices; // Geräte-ID zu Gerätendetails
    }

    mapping(uint256 => Organization) public organizations; // Organisationen durch NFT-Token-ID

    constructor() ERC721("DeviceOrganization", "DO") {}

    function createOrganization() external {
        uint256 tokenId = totalSupply() + 1;
        _mint(msg.sender, tokenId);
        organizations[tokenId].admin = msg.sender;
        _grantRole(tokenId, msg.sender, ADMIN_ROLE);
    }

    function grantUserRole(uint256 tokenId, address user, uint256 role) external {
        require(role == ADMIN_ROLE || role == USER_ROLE, "Invalid role");
        require(ownerOf(tokenId) == msg.sender, "Only organization admin can grant roles");
        organizations[tokenId].userRoles[user] = role;
    }

    function createDevice(uint256 tokenId, uint256 deviceId, string memory deviceName) external {
        require(organizations[tokenId].userRoles[msg.sender] == ADMIN_ROLE, "Only admins can create devices");
        organizations[tokenId].devices[deviceId] = Device(deviceName);
    }

    function getDevice(uint256 tokenId, uint256 deviceId) external view returns (string memory) {
        return organizations[tokenId].devices[deviceId].name;
    }

}
