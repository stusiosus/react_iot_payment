// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Device.sol";
import "hardhat/console.sol";
import "./Organization.sol";

contract DeviceFactory{

    struct DeviceInfo {
        address deviceAddress;
        uint256 id;
        string name;
        address actionFactoryAddress;
        address organisationAddress;
    }

    mapping(uint256 => DeviceInfo) private Devices;
    uint256 public deviceCounter=1;

    event DeviceCreated(address indexed action, uint256 indexed id, string name,address actionFactoryAddress);

    function createDevice(string memory _name, address _actionFactoryAddress,address _organizationAddress) public returns(address) {
       
        
        require(Organization(_organizationAddress).isAdmin(msg.sender)," no AdminNFT -> not allowed to create an Device");

        Device newDevice = new Device(deviceCounter, _name, _actionFactoryAddress,msg.sender,_organizationAddress);
        emit DeviceCreated(address(newDevice), deviceCounter, _name, _actionFactoryAddress);
        
        Devices[deviceCounter] = DeviceInfo(address(newDevice), deviceCounter, _name, _actionFactoryAddress,_organizationAddress);
        deviceCounter++;
    
        
        return address(newDevice);
    }

    function getDevices(address _organizationAddress) external view returns(DeviceInfo[] memory) {
        
        require(Organization(_organizationAddress).balanceOf(msg.sender)>0," no UserNFT -> not allowed to create an Device");

        DeviceInfo[] memory deviceList = new DeviceInfo[](deviceCounter - 1);

        for (uint256 i = 1; i < deviceCounter; i++) {

            if (Devices[i].organisationAddress==_organizationAddress)
            {deviceList[i - 1] = Devices[i];}
        }
        return deviceList;
    }
}
