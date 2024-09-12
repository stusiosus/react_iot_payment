// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Device.sol";
import "hardhat/console.sol";
import "./Organization.sol";

contract DeviceFactory {

    struct DeviceInfo {
        address deviceAddress;
        uint256 id;
        string name;
        address actionFactoryAddress;
        address organisationAddress;
    }

    mapping(uint256 => DeviceInfo) private Devices;
    uint256 public deviceCounter = 1;

    event DeviceCreated(address indexed device, uint256 indexed id, string name, address actionFactoryAddress);
    event DeviceUpdated(uint256 indexed id, string newName);
    event DeviceDeleted(uint256 indexed id);

    function createDevice(string memory _name, address _actionFactoryAddress, address _organizationAddress) public returns (address) {
        require(Organization(_organizationAddress).isAdmin(msg.sender), "No AdminNFT -> not allowed to create a Device");

        Device newDevice = new Device(deviceCounter, _name, _actionFactoryAddress,msg.sender ,address(this), _organizationAddress);
        emit DeviceCreated(address(newDevice), deviceCounter, _name, _actionFactoryAddress);

        Devices[deviceCounter] = DeviceInfo(address(newDevice), deviceCounter, _name, _actionFactoryAddress, _organizationAddress);
        deviceCounter++;

        return address(newDevice);
    }

    function updateDeviceName(uint256 _deviceId, string memory _newName) public {
        require(Devices[_deviceId].deviceAddress != address(0), "Device does not exist");
        require(Organization(Devices[_deviceId].organisationAddress).isAdmin(msg.sender), "No AdminNFT -> not allowed to update the device");
        Device device = Device(Devices[_deviceId].deviceAddress);
        device.updateName(_newName);
        Devices[_deviceId].name = _newName;
        emit DeviceUpdated(_deviceId, _newName);
    }

    function deleteDevice(uint256 _deviceId) public {
        require(Devices[_deviceId].deviceAddress != address(0), "Device does not exist");
        require(Organization(Devices[_deviceId].organisationAddress).isAdmin(msg.sender), "No AdminNFT -> not allowed to delete the device");

        Device device = Device(Devices[_deviceId].deviceAddress);
  

        delete Devices[_deviceId];

        emit DeviceDeleted(_deviceId);
    }

  function getDevices(address _organizationAddress) external view returns (DeviceInfo[] memory) {
    require(Organization(_organizationAddress).balanceOf(msg.sender) > 0, "No UserNFT -> not allowed to get devices");

    uint256 validDeviceCount = 0;

    for (uint256 i = 1; i < deviceCounter; i++) {
        if (Devices[i].organisationAddress == _organizationAddress) {
            validDeviceCount++;
        }
    }
    DeviceInfo[] memory deviceList = new DeviceInfo[](validDeviceCount);
    uint256 index = 0;

    for (uint256 i = 1; i < deviceCounter; i++) {
        if (Devices[i].organisationAddress == _organizationAddress) {
            deviceList[index] = Devices[i];
            index++;
        }
    }

    return deviceList;
}

}
