const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Voting", function () {
  let Voting, voting, Organization, organization, Action, action;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the Organization contract
    Organization = await ethers.getContractFactory("Organization");
    organization = await Organization.deploy("Test Organization", "TST", owner.address);
    await organization.deployed();

     // Deploy the Organization contract
     Device = await ethers.getContractFactory("Device");
     device = await Device.deploy(1,"Test Device", addr2.address, addr1.address, organization.address);
     await device.deployed();
 

    // Deploy the Action contract
    Action = await ethers.getContractFactory("Action");
    action = await Action.deploy(1, "Test Action", "Unit", 1000, addr1.address, addr1.address);
    await action.deployed();

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
    expect(proposal.actionAddress).to.equal(action.address);
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
    await voting.createProposal("Test Proposal 1", organization.address, action.address, 3600);
    await voting.createProposal("Test Proposal 2", organization.address, action.address, 7200);

    const proposals = await voting.getProposalsByOrganization(organization.address);
    expect(proposals.length).to.equal(2);
    expect(proposals[0].description).to.equal("Test Proposal 1");
    expect(proposals[1].description).to.equal("Test Proposal 2");
  });
});
