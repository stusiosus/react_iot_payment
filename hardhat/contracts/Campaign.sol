// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";
contract Campaign {
    uint256 public id;
    string public description;
    address public organizationAddress;
    address payable public actionAddress;
    uint256 public totalAmount;
    uint256 public targetAmount;
    uint256 public startTime;
    uint256 public duration;
    address public creator;
    mapping(address => uint256) public contributions;
    address[] public contributors;
    bool public active;

    event Contributed(address contributor, uint256 amount);
    event CampaignEnded(bool successful);
    event ContributionsRefunded();

    constructor(
        uint256 _id,
        string memory _description,
        address _organizationAddress,
        address payable _actionAddress,
        uint256 _targetAmount,
        uint256 _startTime,
        uint256 _duration,
        address _creator
    ) {
        id = _id;
        description = _description;
        organizationAddress = _organizationAddress;
        actionAddress = _actionAddress;
        targetAmount = _targetAmount;
        startTime = _startTime;
        duration = _duration;
        creator = _creator;
        active = true;
    }

    receive() external payable {
        require(
            block.timestamp <= startTime + duration,
            "Fundraising period has ended"
        );

        contributions[msg.sender] += msg.value;
        totalAmount += msg.value;
        contributors.push(msg.sender);

        emit Contributed(msg.sender, msg.value);

        if (totalAmount >= targetAmount) {
            endCampaign();
        }
    }

    function endCampaign() public {
        require(
            block.timestamp > startTime + duration ||
                totalAmount >= targetAmount,
            "Fundraising period has not ended"
        );

        bool successful = totalAmount >= targetAmount;

        if (successful) {
            (bool success, ) = actionAddress.call{value: totalAmount}("");
            require(success, "Transfer failed");
            active = false;
        } else {
            refundContributions();
        }

        emit CampaignEnded(successful);
    }

    function refundContributions() private {
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 amount = contributions[contributor];
            if (amount > 0) {
                contributions[contributor] = 0;
                (bool success, ) = contributor.call{value: amount}("");
                require(success, "Refund failed");
            }
        }

        active = false;

        emit ContributionsRefunded();
    }

    function getContributions(
        address contributor
    ) external view returns (uint256) {
        return contributions[contributor];
    }

    function getContributors() external view returns (address[] memory) {
        return contributors;
    }

    function getCreator() external view returns (address) {
        return creator;
    }
}
