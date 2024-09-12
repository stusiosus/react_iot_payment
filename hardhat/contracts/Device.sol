// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./ActionFactory.sol";
import "hardhat/console.sol";
import "./Organization.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Device is Ownable {
    uint256 public id;
    string public name;
    ActionFactory public actionFactory;

    Organization private organization;
    address deviceFactoryAddress;

    mapping(uint256 => address) public actionToDevice;

    constructor(uint256 _id, string memory _name, address _actionFactoryAddress, address _deviceOwner,address _deviceFactoryAddress, address _organisationAddress) Ownable(_deviceOwner) {
        id = _id;
        name = _name;
        actionFactory = ActionFactory(_actionFactoryAddress);
        organization = Organization(_organisationAddress);
        deviceFactoryAddress=_deviceFactoryAddress;
    }

    function addAction(string memory _name, string memory _unit, uint32 _pricePerUnit) public returns (address) {
        require(organization.isAdmin(msg.sender), "No AdminNFT -> not allowed to create a Device");
        address actionAddress = actionFactory.createAction(_name, _unit, _pricePerUnit, payable(address(this)), msg.sender, address(organization));
        actionToDevice[id] = actionAddress;
        return actionAddress;
    }

    function updateName(string memory _newName) external  {
        require(msg.sender==deviceFactoryAddress, "Only the DeviceFactory is allowed to call this Contract");
        name = _newName;
    }

 
}
