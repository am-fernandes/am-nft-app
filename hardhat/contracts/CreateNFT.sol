// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CreateNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address contractAddress; //

    constructor(address marketplaceAddress) ERC721("AM NFT Marketplace", "AMNFT") {
        contractAddress = marketplaceAddress; //
    }

    function approveNFTHandle(address nftMarketAddress, uint tokenId) public {
        approve(nftMarketAddress, tokenId);
    }

    function createToken(string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        setApprovalForAll(contractAddress, true);
        
        return newItemId;
    }
}