const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Device", function () {
    let owner;
    let addr1;
    let actionFactory;
    let organization;
    let device;

    beforeEach(async function () {
        // Get signers
        [owner, addr1] = await ethers.getSigners();

        // Deploy Organization contract
        const Organization = await ethers.getContractFactory("Organization");
        organization = await Organization.deploy();
        await organization.deployed();

        // Mint Admin NFT for owner
        await organization.mintAdminNFT(owner.address);

        // Deploy ActionFactory contract
        const ActionFactory = await ethers.getContractFactory("ActionFactory");
        actionFactory = await ActionFactory.deploy();
        await actionFactory.deployed();

        // Deploy Device contract
        const Device = await ethers.getContractFactory("Device");
        device = await Device.deploy(1, "TestDevice", actionFactory.address, owner.address, organization.address);
        await device.deployed();
    });

    it("should add an Action", async function () {
        const actionAddress = await device.addAction("TestAction", "unit", 100);

        const Action = await ethers.getContractFactory("Action");
        const action = Action.attach(actionAddress);

        const deviceActionAddress = await device.actionToDevice(1);
        expect(deviceActionAddress).to.equal(actionAddress);
    });

    it("should update the Device's name", async function () {
        await device.updateName("UpdatedDevice");

        expect(await device.name()).to.equal("UpdatedDevice");
    });
});
