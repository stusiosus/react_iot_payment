// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Device.sol";
import "hardhat/console.sol";

contract DeviceFactory{

    struct DeviceInfo {
        address deviceAddress;
        uint256 id;
        string name;
        address actionFactoryAddress;
    }
    
    mapping(uint256 => DeviceInfo) public Devices;
    uint256 public deviceCounter=1;

    event DeviceCreated(address indexed action, uint256 indexed id, string name,address actionFactoryAddress);

    function createDevice(string memory _name, address _actionFactoryAddress) public returns(address) {
        console.log(
        "Transferring from %s wtih name %s and actionfactoryAddress:  %s ",
        msg.sender,
        _name,
        _actionFactoryAddress
    );
        Device newDevice = new Device(deviceCounter, _name, _actionFactoryAddress,msg.sender);
        emit DeviceCreated(address(newDevice), deviceCounter, _name, _actionFactoryAddress);
        
        Devices[deviceCounter] = DeviceInfo(address(newDevice), deviceCounter, _name, _actionFactoryAddress);
        deviceCounter++;
        
        return address(newDevice);
    }

    function getDevices() external view returns(DeviceInfo[] memory) {
        DeviceInfo[] memory deviceList = new DeviceInfo[](deviceCounter - 1);

        for (uint256 i = 1; i < deviceCounter; i++) {
            deviceList[i - 1] = Devices[i];
        }
        return deviceList;
    }
}
