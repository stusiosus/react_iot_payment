// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Device.sol";
import "hardhat/console.sol";
import "./ActionFactory.sol";
import "./Balance.sol";
import "hardhat/console.sol";

contract Action is Ownable {

    uint256 id;
    string name;
    string unit;
    uint256 pricePerUnit;

    Device public device;

    Balance private balance;

    ActionFactory private actionFactory;

    modifier checkEnoughBalance() {
        require(balance.getBalance(msg.sender) >= pricePerUnit, "Insufficient Balance");
        _;
    }

    receive() external payable {
        require(msg.value >= pricePerUnit);
        (bool success, ) = device.owner().call{value: msg.value}("");
        require(success, "Transfer failed");
        actionFactory.logPayedAction(address(this), id, name, msg.value / pricePerUnit);
    }

    constructor(uint256 _id, string memory _name, string memory _unit, uint256 _pricePerUnit, address payable _deviceAddress, address payable _balanceAddress) Ownable(msg.sender) {
        id = _id;
        name = _name;
        unit = _unit;
        pricePerUnit = _pricePerUnit;
        device = Device(_deviceAddress);
        balance = Balance(_balanceAddress);
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

    function payActionWithBalance(uint256 _amount) external checkEnoughBalance {
        bool success = actionFactory.Balancetransfer(id, msg.sender, device.owner(), _amount * pricePerUnit);
        require(success, "Transfer failed");
        actionFactory.logPayedAction(address(this), id, name, _amount);
    }

    function possibleActionsAmount() public view returns (uint256) {
        return balance.getBalance(msg.sender) / pricePerUnit;
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
}