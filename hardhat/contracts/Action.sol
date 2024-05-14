// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Device.sol";
import "hardhat/console.sol";
import"./ActionFactory.sol";
import "./Balance.sol";

contract Action is Ownable{

    uint256 id;
    string name;
    string unit;
    uint256 pricePerUnit;
    
    Device public device;

    Balance private balance;

    ActionFactory private actionFactory;



    modifier checkEnoughtBalance(){
        require(balance.getBalance(msg.sender) >= pricePerUnit,"Insufficient Balacne");
        _;
    }

    constructor(uint256 _id,string memory _name,string memory _unit,uint256 _pricePerUnit, address payable _deviceAddress, address payable _balanceAddress) Ownable(msg.sender){
        //@dev: check if the Contract is only called by device Contract -> replace the address by the Factory contract address
        require(msg.sender==address(msg.sender));
        id=_id;
        name=_name;
        unit=_unit;
        pricePerUnit=_pricePerUnit;
        device= Device(_deviceAddress);
        balance=Balance(_balanceAddress);
        actionFactory=ActionFactory(msg.sender);
    }

     //@note: set the price for the given unit
     function setPrice(uint256 _price) external onlyOwner() {
        pricePerUnit=_price;
    }

    function payAction(uint256 _amount)external checkEnoughtBalance(){
        actionFactory.Balancetransfer(id,msg.sender,device.owner(),(_amount*pricePerUnit));
    }
    function possibleActions()external view returns(uint256){
        return (balance.getBalance(msg.sender)/pricePerUnit);
    }



}