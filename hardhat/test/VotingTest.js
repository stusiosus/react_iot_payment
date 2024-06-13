const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let Voting, voting, Organization, organization, Action, action,actionAddress,actionFactory;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();


    const OrgnizationFactory=await ethers.getContractFactory("OrganizationFactory");
    const orgnizationFactory=await OrgnizationFactory.deploy();
    await orgnizationFactory.deployed();

    
    const DeviceFactory=await ethers.getContractFactory("DeviceFactory");
    const deviceFactory=await DeviceFactory.deploy();
    await deviceFactory.deployed();

  
    // Deploy ActionFactory contract
    const ActionFactory = await ethers.getContractFactory("ActionFactory");
    actionFactory = await ActionFactory.deploy();
    await actionFactory.deployed();


    const organisationName="Test Organization";
    await orgnizationFactory.createOrganization(organisationName);
    const DeviceName="Device";
    const organizations=await orgnizationFactory.getOrganizations()

    const OrganiZation=await ethers.getContractFactory("Organization");
    organization=await OrganiZation.attach(organizations[0].NFTAddress)

 
    await organization.mint(addr1.address,0)
    await organization.mint(addr2.address,1)


    await deviceFactory.createDevice(DeviceName,actionFactory.address,organizations[0].NFTAddress)
  
    const devices=await deviceFactory.getDevices(organizations[0].NFTAddress);
    const Device= await ethers.getContractFactory("Device");
    const device=  Device.attach(devices[0].deviceAddress)

    await device.addAction("Test Action", "UNIT", 1000)

    const actions=await actionFactory.getActions(devices[0].deviceAddress);

    actionAddress=actions[0].ActionAddress;

    console.log(actionAddress);

    const Action= await ethers.getContractFactory("Action");
    action=Action.attach(actionAddress);
    


    // Deploy the Voting contract
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.deployed();

  });

  it("should create a proposal", async function () {
    await voting.createProposal("Test Proposal", organization.address, action.address, 3600);
    const proposal = await voting.proposals(1);

    expect(proposal.description).to.equal("Test Proposal");
    expect(proposal.organizationAddress).to.equal(organization.address);
    expect(proposal.actionAddress).to.equal(actionAddress);
    expect(proposal.duration).to.equal(3600);
  });

  it("should allow voting", async function () {
  
    await voting.createProposal("Test Proposal", organization.address, action.address, 3600);

    await organization.mint(addr1.address, 0);
    const proposals = await voting.getProposalsByOrganization(organization.address);
    
    const pricePerVote = proposals[0].pricePerVote
   

    await voting.connect(addr1).vote(1, true, { value: pricePerVote });
    const proposal = await voting.proposals(1);

    expect(proposal.yesVotes).to.equal(1);
    expect(await voting.votesSent(1, addr1.address)).to.equal(pricePerVote);
  });

  it("should end voting and execute action if approved", async function () {
    // Create a proposal
    await voting.createProposal("Test Proposal", organization.address, action.address, 3600);

    // Mint an NFT to addr1
    await organization.mint(addr1.address, 0);

    // Retrieve proposals by the organization
    const proposals = await voting.getProposalsByOrganization(organization.address);
    const pricePerVote = proposals[0].pricePerVote;


    // addr1 votes on the proposal
    await voting.connect(addr1).vote(1, true, { value: pricePerVote });

    // Fast-forward time
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");

    // Expect the voting to end and the VoteEnded event to be emitted
    await expect(voting.endVote(1))
      .to.emit(voting, "VoteEnded")
      .withArgs(1, true);

    await expect(voting.endVote(1))
      .to.emit(actionFactory, "PayedAction")
      .withArgs(actionAddress,1,"Test Action",1000);
    
  });

  it("should refund votes if not approved", async function () {
    await voting.createProposal("Test Proposal", organization.address, action.address, 3600);

    await organization.mint(addr1.address, 0);
    const proposals = await voting.getProposalsByOrganization(organization.address);
    
    const pricePerVote = proposals[0].pricePerVote

    await voting.connect(addr1).vote(1, false, { value: pricePerVote });

    // Fast-forward time
    await ethers.provider.send("evm_increaseTime", [3601]);
    await ethers.provider.send("evm_mine");

    await expect(voting.endVote(1)).to.emit(voting, "VotesRefunded").withArgs(1);
  });

  it("should get the sent amount by a specific voter", async function () {
    await voting.createProposal("Test Proposal", organization.address, action.address, 3600);

    await organization.mint(addr1.address, 0);
    const proposals = await voting.getProposalsByOrganization(organization.address);
    
    const pricePerVote = proposals[0].pricePerVote

    await voting.connect(addr1).vote(1, true, { value: pricePerVote });

    const sentAmount = await voting.getSentAmount(1, addr1.address);
    expect(sentAmount).to.equal(pricePerVote);
  });

  it("should retrieve all proposals by an organization", async function () {
    await voting.createProposal("Test Proposal 1", organization.address, actionAddress, 3600);
    await voting.createProposal("Test Proposal 2", organization.address, actionAddress, 7200);

    const proposals = await voting.getProposalsByOrganization(organization.address);
    expect(proposals.length).to.equal(2);
    expect(proposals[0].description).to.equal("Test Proposal 1");
    expect(proposals[1].description).to.equal("Test Proposal 2");
  });
});
