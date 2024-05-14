// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ActionFactory.sol";
import "hardhat/console.sol";
import "./Organization.sol";

contract Device is Ownable {
    uint256 public id;
    string public name;
    ActionFactory public actionFactory;

    Organization private organization;


    mapping(uint256 => address) public actionToDevice;
    mapping(address => uint256) public userBalances;

    constructor(uint256 _id, string memory _name, address _actionFactoryAddress, address _deviceOwner, address _organisationAddress) Ownable(_deviceOwner) {
        id = _id;
        name = _name;
        actionFactory = ActionFactory(_actionFactoryAddress);
        organization=Organization(_organisationAddress);
    }

    modifier checkAdminAccess(){
        _;
    }

    receive() external payable {
        userBalances[msg.sender] += msg.value;
    }
    function withdrawFunds(uint256 _amount) external onlyOwner() {
        require (userBalances[msg.sender]>=_amount,"insufficient balance");
        userBalances[msg.sender]-=_amount;
        (bool success,) =msg.sender.call{value:_amount}("");
        require(success,"Withdraw failed");
    }

    function getBalanceUser(address _user) public view returns (uint256) {
        return userBalances[msg.sender];
    }

    function getBalanceDevice() external view onlyOwner() returns (uint256) {     
        return address(this).balance;
    }

    function addAction(string memory _name, string memory _unit, uint32 _pricePerUnit) public onlyOwner() {
        // Create Action contract instance using ActionFactory
        address actionAddress = actionFactory.createAction(_name, _unit, _pricePerUnit,payable(address(this)),msg.sender);
        // Store the Action contract address
        actionToDevice[id] = actionAddress;
    }
}
