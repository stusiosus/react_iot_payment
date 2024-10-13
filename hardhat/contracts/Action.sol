// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Device.sol";
import "hardhat/console.sol";

contract Action is Ownable {
    uint256 id;
    string name;
    string unit;
    uint256 pricePerUnit;

    Device public device;

    ActionFactory private actionFactory;

    receive() external payable {
        if (msg.value < pricePerUnit) {
            actionFactory.logInsufficientPayment(
                address(this),
                id,
                msg.sender,
                msg.value,
                pricePerUnit
            );
            revert("Insufficient payment");
        }
        (bool success, ) = device.owner().call{value: msg.value}("");
        require(success, "Transfer failed");
        actionFactory.logPayedAction(
            address(this),
            id,
            name,
            msg.value / pricePerUnit
        );
    }

    constructor(
        uint256 _id,
        string memory _name,
        string memory _unit,
        uint256 _pricePerUnit,
        address payable _deviceAddress
    ) Ownable(msg.sender) {
        id = _id;
        name = _name;
        unit = _unit;
        pricePerUnit = _pricePerUnit;
        device = Device(_deviceAddress);
        actionFactory = ActionFactory(msg.sender);
    }

    function setPrice(uint256 _price) external onlyOwner {
        pricePerUnit = _price;
    }

    function setName(string memory _name) external onlyOwner {
        name = _name;
    }

    function setUnit(string memory _unit) external onlyOwner {
        unit = _unit;
    }

    function getPricePerUnit() public view returns (uint256) {
        return pricePerUnit;
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getUnit() public view returns (string memory) {
        return unit;
    }

    function selfDestruct() external onlyOwner {
        selfdestruct(payable(device.owner()));
    }
}
