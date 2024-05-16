// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./Organization.sol";


contract OrganizationFactory {
    uint256 private nextOrganizationId = 1;

    struct OrganizationInfo {
        uint256 id;
        string name;
        address creator;
        address NFTAddress;
    }

    mapping(address => OrganizationInfo) private organizations;
    mapping(address => OrganizationInfo[]) private userToOrganizations; // Updated to store multiple Organizations per user

    // Event emitted when a new Organization is created
    event OrganizationCreated(uint256 indexed organizationId, string name, address creator);

    // Event emitted when an Organization's admin NFT is minted
    event AdminNFTMinted(uint256 indexed organizationId, address adminNFTAddress, address creator);


    // Function to create a new Organization and mint admin NFT
    function createOrganization(string memory name) external returns(address){
        uint256 organizationId = nextOrganizationId++;
       
        Organization NFT = new Organization(name, name,msg.sender);
        
        OrganizationInfo storage org = organizations[address(NFT)];
        org.id = organizationId;
        org.name = name;
        org.creator = msg.sender;
        org.NFTAddress = address(NFT);

        userToOrganizations[msg.sender].push(org);

        emit OrganizationCreated(organizationId, name, msg.sender);
        emit AdminNFTMinted(organizationId, address(NFT), msg.sender);

        return address(NFT);
    }

    // Function to add an NFT address to a user's Organizations
    function addOrganization(address _nftAddress) external {
        require(Organization(_nftAddress).balanceOf(msg.sender) > 0, "You have no access to this Organization");
        userToOrganizations[msg.sender].push(organizations[_nftAddress]);
    }

    // Function to add an NFT address to a user's Organizations
    function getOrganizations() external view returns( OrganizationInfo[] memory) {

        return userToOrganizations[msg.sender];
    }
   
}
