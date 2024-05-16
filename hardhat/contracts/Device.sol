// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./ActionFactory.sol";
import "hardhat/console.sol";
import "./Organization.sol";

contract Device is Ownable{
    uint256 public id;
    string public name;
    ActionFactory public actionFactory;

    Organization private organization;


    mapping(uint256 => address) public actionToDevice;

    constructor(uint256 _id, string memory _name, address _actionFactoryAddress, address _deviceOwner, address _organisationAddress) Ownable(_deviceOwner) {
        id = _id;
        name = _name;
        actionFactory = ActionFactory(_actionFactoryAddress);
        organization=Organization(_organisationAddress);
    }

 
   
    function addAction(string memory _name, string memory _unit, uint32 _pricePerUnit) public  {

        require(organization.isAdmin(msg.sender)," no AdminNFT -> not allowed to create an Device");
       
        address actionAddress = actionFactory.createAction(_name, _unit, _pricePerUnit,payable(address(this)),msg.sender,address(organization));
   
        actionToDevice[id] = actionAddress;
    }
}
