const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fundraising and Campaign Tests", function () {
  let OrganizationFactory, organizationFactory;
  let DeviceFactory, deviceFactory;
  let ActionFactory, actionFactory;
  let FundraisingFactory, fundraisingFactory;
  let Organization, orgContract;
  let owner, admin, user, addr1;

  beforeEach(async function () {
    // Fetch contract factories
    [owner, admin, user, addr1] = await ethers.getSigners();

    OrganizationFactory = await ethers.getContractFactory(
      "OrganizationFactory"
    );
    DeviceFactory = await ethers.getContractFactory("DeviceFactory");
    ActionFactory = await ethers.getContractFactory("ActionFactory");
    FundraisingFactory = await ethers.getContractFactory("Fundraising");
    Organization = await ethers.getContractFactory("Organization");

    // Deploy the contracts
    organizationFactory = await OrganizationFactory.deploy();
    deviceFactory = await DeviceFactory.deploy();
    actionFactory = await ActionFactory.deploy();
    fundraisingFactory = await FundraisingFactory.deploy();
  });

  it("Should create a new campaign and allow contributions", async function () {
    const orgName = "My Organization";
    const deviceName = "My Device";
    const actionName = "My Action";
    const actionUnit = "Energy";
    const actionPricePerUnit = "10"; // Use ethers utility for conversion
    const campaignDescription = "Campaign to support my device";
    const campaignDuration = 60 * 60 * 24; // 1 day
    const campaignAmount = 5; // Number of units needed

    // Create an organization
    await organizationFactory.connect(owner).createOrganization(orgName);
    const organizationAddress = await organizationFactory.getOrganizations();

    // Create a Device
    await deviceFactory
      .connect(owner)
      .createDevice(
        deviceName,
        actionFactory.address,
        organizationAddress[0].NFTAddress
      );

    // Create an Action for the device
    const deviceAddress = await deviceFactory.getDevices(
      organizationAddress[0].NFTAddress
    );
    const deviceContract = await ethers.getContractAt(
      "Device",
      deviceAddress[0].deviceAddress
    );
    await deviceContract
      .connect(owner)
      .addAction(actionName, actionUnit, actionPricePerUnit);

    // Create a Campaign
    //const targetAmount = actionPricePerUnit.mul(campaignAmount); // Calculate target amount based on units
    const createCampaignTx = await fundraisingFactory
      .connect(owner)
      .createCampaign(
        campaignDescription,
        organizationAddress[0].NFTAddress,
        actionFactory.address,
        campaignDuration,
        campaignAmount
      );
    const createCampaignReceipt = await createCampaignTx.wait();
    const campaignCreatedEvent = createCampaignReceipt.events.find(
      (e) => e.event === "CampaignCreated"
    );
    const campaignAddress = campaignCreatedEvent.args.campaignAddress;

    const campaignContract = await ethers.getContractAt(
      "Campaign",
      campaignAddress
    );

    // User sends payment for the campaign
    const contributionAmount = actionPricePerUnit; // Adjust as needed
    await expect(() =>
      user.sendTransaction({
        to: campaignAddress,
        value: contributionAmount,
      })
    ).to.changeEtherBalance(user, -contributionAmount);

    // Verify contributions and campaign status
    const contributorAmount = await campaignContract.getContributions(
      user.address
    );
    expect(contributorAmount).to.equal(contributionAmount);

    // Simulate ending the campaign by advancing time
    await ethers.provider.send("evm_increaseTime", [campaignDuration + 1]); // Advance time by campaign duration + 1 second
    await ethers.provider.send("evm_mine"); // Mine a new block

    await campaignContract.connect(owner).endCampaign();

    // Verify that the campaign is no longer active
    expect(await campaignContract.active()).to.be.false;

    // Verify that the campaign was successful and funds were transferred
    const actionBalance = await ethers.provider.getBalance(
      actionFactory.address
    );
    expect(actionBalance).to.equal(contributionAmount);

    // Test refund case
    // Create another campaign with a target amount larger than the contribution
    const newCampaignTx = await fundraisingFactory
      .connect(owner)
      .createCampaign(
        "Another Campaign",
        organizationAddress[0].NFTAddress,
        actionFactory.address,
        campaignDuration,
        campaignAmount * 10 // Target amount larger than contribution
      );
    const newCampaignReceipt = await newCampaignTx.wait();
    const newCampaignCreatedEvent = newCampaignReceipt.events.find(
      (e) => e.event === "CampaignCreated"
    );
    const newCampaignAddress = newCampaignCreatedEvent.args.campaignAddress;

    const newCampaignContract = await ethers.getContractAt(
      "Campaign",
      newCampaignAddress
    );

    // User sends payment for the new campaign
    await expect(() =>
      user.sendTransaction({
        to: newCampaignAddress,
        value: contributionAmount,
      })
    ).to.changeEtherBalance(user, -contributionAmount);

    // Simulate ending the new campaign with insufficient funds
    await ethers.provider.send("evm_increaseTime", [campaignDuration + 1]); // Advance time by campaign duration + 1 second
    await ethers.provider.send("evm_mine"); // Mine a new block

    await newCampaignContract.connect(owner).endCampaign();

    // Verify that the contributions are refunded
    expect(await newCampaignContract.active()).to.be.false;
    await expect(() =>
      user.sendTransaction({
        to: newCampaignAddress,
        value: 0,
      })
    ).to.changeEtherBalance(user, contributionAmount);
  });
});
