// test/DeviceFactory.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeviceFactory", function () {
  let DeviceFactory;
  let Organization;
  let ActionFactory;
  let Device;
  let owner;
  let user;
  let organizationAdmin;

  beforeEach(async function () {
    [owner, user, organizationAdmin] = await ethers.getSigners();

    Organization = await ethers.getContractFactory("Organization");
    ActionFactory = await ethers.getContractFactory("ActionFactory");
    Device = await ethers.getContractFactory("Device");
    DeviceFactory = await ethers.getContractFactory("DeviceFactory");

    this.organization = await Organization.deploy("Organization", "ORG", organizationAdmin.address);
    await this.organization.deployed();

    this.actionFactory = await ActionFactory.deploy();
    await this.actionFactory.deployed();

    this.deviceFactory = await DeviceFactory.deploy();
    await this.deviceFactory.deployed();
  });

  it("should allow organization admin to create device", async function () {
    const deviceName = "Test Device";

    // Grant admin NFT to organization admin
    await this.organization.mint(organizationAdmin.address, 0);
   

    // Create device
    await expect(this.deviceFactory.connect(organizationAdmin).createDevice(deviceName, this.actionFactory.address, this.organization.address))
      .to.emit(this.deviceFactory, "DeviceCreated")
      .withArgs(await this.deviceFactory.getDevices(this.organization.address).length + 1, deviceName, organizationAdmin.address);

    const devices = await this.deviceFactory.getDevices(this.organization.address);
    expect(devices.length).to.equal(1);
    expect(devices[0].name).to.equal(deviceName);
  });

  it("should allow organization user to get devices", async function () {
    const deviceName = "Test Device";

    // Grant user NFT to organization user
    await this.organization.mint(user.address, 1);

    // Create device
    await this.deviceFactory.connect(organizationAdmin).createDevice(deviceName, this.actionFactory.address, this.organization.address);

    // Get devices as user
    const devices = await this.deviceFactory.connect(user).getDevices(this.organization.address);
    expect(devices.length).to.equal(1);
    expect(devices[0].name).to.equal(deviceName);
  });

  it("should not allow non-admin to create device", async function () {
    const deviceName = "Test Device";

    // Grant user NFT to organization user
    await this.organization.mint(user.address, 1);

    // Create device
    await expect(this.deviceFactory.connect(user).createDevice(deviceName, this.actionFactory.address, this.organization.address))
      .to.be.revertedWith("no AdminNFT -> not allowed to create an Device");
  });

  it("should allow organization admin to add action to device", async function () {
    const deviceName = "Test Device";
    const actionName = "Test Action";
    const actionUnit = "unit";
    const actionPrice = 100;

    // Grant admin NFT to organization admin
    await this.organization.mint(organizationAdmin.address, 0);

    // Create device
    await this.deviceFactory.connect(organizationAdmin).createDevice(deviceName, this.actionFactory.address, this.organization.address);

    const devices = await this.deviceFactory.getDevices(this.organization.address);

    // Add action to device
    await expect(this.deviceFactory.connect(organizationAdmin).addActionToDevice(devices[0].id, actionName, actionUnit, actionPrice))
      .to.emit(this.deviceFactory, "ActionAdded")
      .withArgs(devices[0].id, actionName, actionUnit, actionPrice);
  });

  it("should not allow non-admin to add action to device", async function () {
    const deviceName = "Test Device";
    const actionName = "Test Action";
    const actionUnit = "unit";
    const actionPrice = 100;

    // Grant user NFT to organization user
    await this.organization.mint(user.address, 1);

    // Create device
    await this.deviceFactory.connect(organizationAdmin).createDevice(deviceName, this.actionFactory.address, this.organization.address);

    const devices = await this.deviceFactory.getDevices(this.organization.address);

    // Add action to device
    await expect(this.deviceFactory.connect(user).addActionToDevice(devices[0].id, actionName, actionUnit, actionPrice))
      .to.be.revertedWith("no AdminNFT -> not allowed to create an Device");
  });
});
