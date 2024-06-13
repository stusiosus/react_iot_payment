// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Organization.sol";
import "./Action.sol";
import "hardhat/console.sol";

contract Voting {
    struct Proposal {
        string description;
        address organizationAddress;
        address payable actionAddress;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 startTime;
        uint256 duration;
        uint256 pricePerVote;
        mapping(address => bool) hasVoted;
        address[] voters; // Array to store all voters for a proposal
    }

    struct ProposalInfo {
        string description;
        address organizationAddress;
        address actionAddress;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 startTime;
        uint256 duration;
        uint256 pricePerVote;
        address[] voters;
    }

    uint256 private nextProposalId = 1;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256[]) public organizationProposals; // Mapping to store proposal IDs by organization
    mapping(uint256 => mapping(address => uint256)) public votesSent; // Mapping to store the amount sent by each sender for each proposal
    Action private action;

    event ProposalCreated(uint256 indexed proposalId, string description, address organizationAddress, uint256 duration);
    event Voted(uint256 indexed proposalId, address voter, bool approve);
    event VoteEnded(uint256 indexed proposalId, bool approved);
    event VotesRefunded(uint256 indexed proposalId);

    function createProposal(string memory description, address _organizationAddress, address payable _actionAddress, uint256 duration) external {
        // Verify that the caller is an admin of the organization
        require(Organization(_organizationAddress).balanceOf(msg.sender) > 0, "Caller does not hold an organization NFT");

        Proposal storage proposal = proposals[nextProposalId];
        proposal.description = description;
        proposal.organizationAddress = _organizationAddress;
        proposal.startTime = block.timestamp;
        proposal.duration = duration;
        proposal.actionAddress = _actionAddress;

        uint256 nftAmount = Organization(_organizationAddress).getTotalNFTs();
        proposal.pricePerVote = (Action(_actionAddress).getPricePerUnit() / nftAmount);

        organizationProposals[_organizationAddress].push(nextProposalId); // Add proposal ID to the organization's list

        emit ProposalCreated(nextProposalId, description, _organizationAddress, duration);
        nextProposalId++;
    }

    function vote(uint256 proposalId, bool approve) external payable {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.startTime + proposal.duration, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "User has already voted");
        require(Organization(proposal.organizationAddress).balanceOf(msg.sender) > 0, "Caller does not hold an organization NFT");
        require(msg.value >= proposal.pricePerVote, "The sent amount is not enough");

        // Store the sent amount
        votesSent[proposalId][msg.sender] = msg.value;
        proposal.voters.push(msg.sender); // Add voter to the list

        if (approve) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        proposal.hasVoted[msg.sender] = true;

        emit Voted(proposalId, msg.sender, approve);
    }

    function endVote(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.startTime + proposal.duration, "Voting period has not ended");

        bool approved = proposal.yesVotes > proposal.noVotes;

        if (approved) {
            
            console.log("voting is approved");

            uint256 actionAmount = Action(proposal.actionAddress).getPricePerUnit();
           
            proposal.actionAddress.send(actionAmount);
            console.log("aprroeved path end");
            //console.log(actionAmount," was sent to artifact with address ",proposal.actionAddress);
           
        } else {
            refundVotes(proposalId);
        }

        emit VoteEnded(proposalId, approved);

        // Optional: Clean up storage
        delete proposals[proposalId];
    }

    function refundVotes(uint256 proposalId) private {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.startTime + proposal.duration, "Voting period has not ended");

        for (uint256 i = 0; i < proposal.voters.length; i++) {
            address voter = proposal.voters[i];
            uint256 amount = votesSent[proposalId][voter];
            if (amount > 0) {
                votesSent[proposalId][voter] = 0; // Set the amount to 0 before transfer to prevent re-entrancy attacks
                (bool success, ) = voter.call{value: amount}("");
                require(success, "Refund failed");
            }
        }

        emit VotesRefunded(proposalId);
    }

    // Optional: Function to retrieve the amount sent by a specific voter for a specific proposal
    function getSentAmount(uint256 proposalId, address voter) external view returns (uint256) {
        return votesSent[proposalId][voter];
    }

    // Function to retrieve all proposals by a given organization
    function getProposalsByOrganization(address _organizationAddress) external view returns (ProposalInfo[] memory) {
        uint256[] memory proposalIds = organizationProposals[_organizationAddress];
        ProposalInfo[] memory result = new ProposalInfo[](proposalIds.length);

        for (uint256 i = 0; i < proposalIds.length; i++) {
            Proposal storage p = proposals[proposalIds[i]];
            result[i] = ProposalInfo({
                description: p.description,
                organizationAddress: p.organizationAddress,
                actionAddress: p.actionAddress,
                yesVotes: p.yesVotes,
                noVotes: p.noVotes,
                startTime: p.startTime,
                duration: p.duration,
                pricePerVote: p.pricePerVote,
                voters: p.voters
            });
        }

        return result;
    }
}
