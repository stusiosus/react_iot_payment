// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Action.sol";
import "./Organization.sol";
import "hardhat/console.sol";
import "./Device.sol";

contract ActionFactory is Ownable {
    struct ActionInfo {
        uint256 id;
        address payable ActionAddress;
        string name;
        string unit;
        uint256 price;
        address deviceAddress;
        address deviceOwner;
        address organisationAddress;
    }

    mapping(uint256 => ActionInfo) public Actions;
    uint256 actionCounter = 1;

    constructor() Ownable(msg.sender) {}

    event ActionCreated(
        address indexed action,
        uint256 indexed id,
        string name,
        string unit,
        uint256 pricePerUnit,
        address deviceAddress,
        address _organisationAddress
    );
    event PayedAction(
        address actionAddress,
        uint256 id,
        string name,
        uint256 amount
    );
    event ActionUpdated(
        uint256 indexed id,
        string newName,
        string newUnit,
        uint256 newPrice
    );
    event ActionDeleted(uint256 indexed id);
    event InsufficientPayment(
        address actionAddress,
        uint256 actionId,
        address payer,
        uint256 amountPaid,
        uint256 pricePerUnit
    );

    modifier actionExists(uint256 _actionId) {
        require(
            Actions[_actionId].ActionAddress != address(0),
            "Action does not exist"
        );
        _;
    }

    modifier onlyDeviceOwner(uint256 _actionId) {
        Device device = Device(Actions[_actionId].deviceAddress);
        require(
            msg.sender == device.owner(),
            "You are not the Owner of this Device"
        );
        _;
    }

    function createAction(
        string memory _name,
        string memory _unit,
        uint256 _pricePerUnit,
        address payable _deviceAddress,
        address _deviceOwner,
        address _organisationAddress
    ) public returns (address) {
        require(
            msg.sender == _deviceAddress,
            "You are not the Owner of this Device"
        );
        Action newAction = new Action(
            actionCounter,
            _name,
            _unit,
            _pricePerUnit,
            _deviceAddress
        );
        emit ActionCreated(
            address(newAction),
            actionCounter,
            _name,
            _unit,
            _pricePerUnit,
            _deviceAddress,
            _organisationAddress
        );

        Actions[actionCounter] = ActionInfo(
            actionCounter,
            payable(address(newAction)),
            _name,
            _unit,
            _pricePerUnit,
            _deviceAddress,
            _deviceOwner,
            _organisationAddress
        );
        actionCounter++;
        return address(newAction);
    }

    function getActions(
        address _deviceAddress
    ) external view returns (ActionInfo[] memory) {
        ActionInfo[] memory actionList = new ActionInfo[](actionCounter - 1);

        for (uint256 i = 1; i < actionCounter; i++) {
            if (Actions[i].deviceAddress == _deviceAddress) {
                actionList[i - 1] = Actions[i];
            }
        }
        return actionList;
    }

    function updateActionPrice(
        uint256 _actionId,
        uint256 _newPrice
    ) public actionExists(_actionId) onlyDeviceOwner(_actionId) {
        Action action = Action(Actions[_actionId].ActionAddress);
        action.setPrice(_newPrice);
        Actions[_actionId].price = _newPrice;

        emit ActionUpdated(
            _actionId,
            Actions[_actionId].name,
            Actions[_actionId].unit,
            _newPrice
        );
    }

    function updateActionName(
        uint256 _actionId,
        string memory _newName
    ) public actionExists(_actionId) onlyDeviceOwner(_actionId) {
        Action action = Action(Actions[_actionId].ActionAddress);
        action.setName(_newName);
        Actions[_actionId].name = _newName;

        emit ActionUpdated(
            _actionId,
            _newName,
            Actions[_actionId].unit,
            Actions[_actionId].price
        );
    }

    function updateActionUnit(
        uint256 _actionId,
        string memory _newUnit
    ) public actionExists(_actionId) onlyDeviceOwner(_actionId) {
        Action action = Action(Actions[_actionId].ActionAddress);
        action.setUnit(_newUnit);
        Actions[_actionId].unit = _newUnit;

        emit ActionUpdated(
            _actionId,
            Actions[_actionId].name,
            _newUnit,
            Actions[_actionId].price
        );
    }

    function deleteAction(
        uint256 _actionId
    ) public actionExists(_actionId) onlyDeviceOwner(_actionId) {
        Action action = Action(Actions[_actionId].ActionAddress);

        action.selfDestruct();

        delete Actions[_actionId];

        emit ActionDeleted(_actionId);
    }

    function logPayedAction(
        address _actionAddress,
        uint256 _id,
        string memory _name,
        uint256 _amount
    ) external {
        require(
            msg.sender == _actionAddress,
            "Only the action contract can call this function"
        );
        emit PayedAction(_actionAddress, _id, _name, _amount);
    }

    function logInsufficientPayment(
        address _actionAddress,
        uint256 _id,
        address _payer,
        uint256 _amountPaid,
        uint256 _pricePerUnit
    ) external {
        require(
            msg.sender == _actionAddress,
            "Only the action contract can call this function"
        );
        emit InsufficientPayment(
            _actionAddress,
            _id,
            _payer,
            _amountPaid,
            _pricePerUnit
        );
    }
}
