// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Organization.sol";
import "./Action.sol";
import "./Campaign.sol";
import "hardhat/console.sol";

contract Fundraising {
    struct CampaignInfo {
        uint256 id;
        address campaignAddress;
        string description;
        address organizationAddress;
        address actionAddress;
        uint256 totalAmount;
        uint256 targetAmount;
        uint256 startTime;
        uint256 duration;
        address[] contributors;
    }

    uint256 private nextCampaignId = 1;
    mapping(uint256 => address) public campaigns;
    mapping(address => uint256[]) public organizationCampaigns;

    event CampaignCreated(uint256 indexed campaignId, address campaignAddress, string description, address organizationAddress, uint256 duration, uint256 targetAmount);
    event Contributed(uint256 indexed campaignId, address contributor, uint256 amount);
    event CampaignEnded(uint256 indexed campaignId, bool successful);
    event ContributionsRefunded(uint256 indexed campaignId);

    function createCampaign(string memory description, address _organizationAddress, address payable _actionAddress, uint256 duration, uint256 amount) external {
        require(Organization(_organizationAddress).balanceOf(msg.sender) > 0, "Caller does not hold an organization NFT");

        uint256 targetAmount = Action(_actionAddress).getPricePerUnit() * amount;
        Campaign newCampaign = new Campaign(nextCampaignId, description, _organizationAddress, _actionAddress, targetAmount, block.timestamp, duration);
        
        campaigns[nextCampaignId] = address(newCampaign);
        organizationCampaigns[_organizationAddress].push(nextCampaignId);

        emit CampaignCreated(nextCampaignId, address(newCampaign), description, _organizationAddress, duration, targetAmount);
        nextCampaignId++;
    }

    function getCampaignsByOrganization(address _organizationAddress) external view returns (CampaignInfo[] memory) {
        uint256[] memory campaignIds = organizationCampaigns[_organizationAddress];
        uint256 activeCampaignCount = 0;

        for (uint256 i = 0; i < campaignIds.length; i++) {
            Campaign campaign = Campaign(payable(campaigns[campaignIds[i]]));
            if (campaign.active()) { // Check if campaign is active
                activeCampaignCount++;
            }
        }

        CampaignInfo[] memory result = new CampaignInfo[](activeCampaignCount);
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < campaignIds.length; i++) {
            Campaign campaign = Campaign(payable(campaigns[campaignIds[i]]));
            if (campaign.active()) { // Only include active campaigns
                result[resultIndex] = CampaignInfo({
                    id: campaign.id(),
                    campaignAddress: campaigns[campaignIds[i]],
                    description: campaign.description(),
                    organizationAddress: campaign.organizationAddress(),
                    actionAddress: campaign.actionAddress(),
                    totalAmount: campaign.totalAmount(),
                    targetAmount: campaign.targetAmount(),
                    startTime: campaign.startTime(),
                    duration: campaign.duration(),
                    contributors: campaign.getContributors()
                });
                resultIndex++;
            }
        }

        return result;
    }
}
