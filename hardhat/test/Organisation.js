const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OrganizationFactory", function () {
  let OrganizationFactory, organizationFactory;
  let Organization, organization;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the Organization contract
    Organization = await ethers.getContractFactory("Organization");

    // Deploy the OrganizationFactory contract
    OrganizationFactory = await ethers.getContractFactory(
      "OrganizationFactory"
    );
    organizationFactory = await OrganizationFactory.deploy();
    await organizationFactory.deployed();
  });

  it("should create a new Organization and mint an Admin NFT", async function () {
    const tx = await organizationFactory.createOrganization("TestOrg");
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "AdminNFTMinted"
    );

    const organizationAddress = event.args[1];

    const organization = await ethers.getContractAt(
      "Organization",
      organizationAddress
    );

    const isAdmin = await organization.isAdmin(owner.address);

    expect(isAdmin).to.be.true;
  });

  it("should allow the owner to mint a User NFT", async function () {
    // Create organization and mint Admin NFT
    const organizationTx = await organizationFactory.createOrganization(
      "TestOrg"
    );
    const receipt = await organizationTx.wait();
    const organizationAddress = receipt.events.find(
      (event) => event.event === "AdminNFTMinted"
    ).args[1];

    // Attach the deployed organization contract
    organization = await Organization.attach(organizationAddress);

    // Mint a User NFT to addr1
    await organization.mint(addr1.address, 1); // Status.User is represented by `1`
    expect(await organization.balanceOf(addr1.address)).to.equal(1);

    // Check if addr1 is not an Admin
    expect(await organization.isAdmin(addr1.address)).to.equal(false);
  });

  it("should add an existing Organization to a user", async function () {
    // Create organization and mint Admin NFT
    const organizationTx = await organizationFactory.createOrganization(
      "TestOrg"
    );
    const receipt = await organizationTx.wait();
    const organizationAddress = receipt.events.find(
      (event) => event.event === "AdminNFTMinted"
    ).args[1];

    // Attach the deployed organization contract
    organization = await Organization.attach(organizationAddress);

    // Transfer Admin NFT to addr1
    await organization["safeTransferFrom(address,address,uint256)"](
      owner.address,
      addr1.address,
      1
    );

    // Add the organization for addr1
    await organizationFactory
      .connect(addr1)
      .addOrganization(organizationAddress);

    // Retrieve the organizations for addr1
    const userOrgs = await organizationFactory
      .connect(addr1)
      .getOrganizations();
    expect(userOrgs.length).to.equal(1);
    expect(userOrgs[0].NFTAddress).to.equal(organizationAddress);
  });
});
