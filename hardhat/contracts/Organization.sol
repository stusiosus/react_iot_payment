// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721Burnable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721, ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Organization is ERC721, ERC721Enumerable, ERC721Burnable {
    enum Status {
        Admin,
        User
    }
    uint256 tokenId = 1;

    mapping(uint256 => Status) private tokenStatus;

    modifier IsAdmin() {
        require(isAdmin(msg.sender), "no NFT -> not authorized");
        _;
    }

    constructor(
        string memory name,
        string memory symbol,
        address _creator
    ) ERC721(name, symbol) {
        _safeMint(_creator, tokenId);
        tokenStatus[tokenId] = Status.Admin;
    }

    function isAdmin(address owner) public view returns (bool) {
        uint256 balance = balanceOf(owner);
        for (uint256 i = 0; i < balance; i++) {
            uint256 Id = tokenOfOwnerByIndex(owner, i);
            if (tokenStatus[Id] == Status.Admin) {
                return true;
            }
        }
        return false;
    }

    function mint(address to, Status status) external IsAdmin {
        tokenId = tokenId + 1;
        _safeMint(to, tokenId);
        tokenStatus[tokenId] = status;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function getTotalNFTs() public view returns (uint256) {
        return totalSupply();
    }
}
