const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeviceFactory", function () {
  let DeviceFactory;
  let deviceFactory;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    ActionFactory =await ethers.getContractFactory("ActionFactory");
    actionFactory = await ActionFactory.deploy();
    await actionFactory.deployed();
    

    DeviceFactory = await ethers.getContractFactory("DeviceFactory");
    deviceFactory = await DeviceFactory.deploy();
    await deviceFactory.deployed();
  });

  it("Should create a new device", async function () {
    const name = "TestDevice";
    await deviceFactory.createDevice(name, actionFactory.address);
    const devices = await deviceFactory.getDevices();

    expect(devices.length).to.equal(1);
    expect(devices[0]).to.not.equal(ethers.constants.AddressZero);
  });

  it("Should return the correct list of devices", async function () {
    const name1 = "TestDevice1";
    const name2 = "TestDevice2";
    await deviceFactory.createDevice(name1, addr1.address);
    await deviceFactory.createDevice(name2, addr2.address);
    const devices = await deviceFactory.getDevices();

    expect(devices.length).to.equal(2);
    expect(devices[0]).to.not.equal(ethers.constants.AddressZero);
    expect(devices[1]).to.not.equal(ethers.constants.AddressZero);
  });


});
