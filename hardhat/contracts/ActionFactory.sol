// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Action.sol";
import "./Balance.sol";
import "./Organization.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ActionFactory is Ownable {

    struct ActionInfo{
        uint256 id;
        address ActionAddress;
        string name;
        string unit;
        uint256 price;
        address deviceAddress;
        address deviceOwner;
        address organisationAddress;
    }

    mapping (uint256 => ActionInfo ) public Actions;
    uint256 actionCounter=1;

    Balance private balance;

    constructor() Ownable(msg.sender){}

    event ActionCreated(address indexed action, uint256 indexed id, string name, string unit, uint256 pricePerUnit, address deviceAddress,address _organisationAddress);

    function createAction(string memory _name, string memory _unit, uint256 _pricePerUnit, address payable _deviceAddress,address _deviceOwner,address _organisationAddress) public  returns(address){

        Action newAction = new Action(actionCounter, _name, _unit, _pricePerUnit, _deviceAddress, payable(address(balance)));
        emit ActionCreated(address(newAction), actionCounter, _name, _unit, _pricePerUnit,_deviceAddress ,_organisationAddress);


        Actions[actionCounter]= ActionInfo(actionCounter,address(newAction), _name, _unit, _pricePerUnit, _deviceAddress,_deviceOwner,_organisationAddress);
        actionCounter++;
        return address(newAction);
    }

    function setBalanceContract(address payable _balanceAddress)external onlyOwner(){
        balance = Balance(_balanceAddress); 
    }


    function getActions(address _deviceAddress)external view returns(ActionInfo[] memory){

    ActionInfo[] memory actionList = new ActionInfo [](actionCounter-1);

     for (uint256 i = 1; i < actionCounter; i++) {
        if (Actions[i].deviceAddress==_deviceAddress){
            actionList[i - 1] = Actions[i];
            }
        }
        return actionList;
    }

     function updateActionPrice(uint256 _actionId, uint256 _newPrice) public {
        require(Actions[_actionId].ActionAddress != address(0), "Action does not exist");
        require(Organization(Actions[_actionId].organisationAddress).isAdmin(msg.sender)," no AdminNFT -> not allowed to create an Device");

        Action action = Action(Actions[_actionId].ActionAddress);
        action.setPrice(_newPrice);
        Actions[_actionId].price = _newPrice;
    }


    function Balancetransfer(uint256 _id,address _from, address _to, uint256 _amount) external{
        require(msg.sender==Actions[_id].ActionAddress, "You are not allowed to call this function");
        balance.transferBalance(_from, _to, _amount);
    }
}