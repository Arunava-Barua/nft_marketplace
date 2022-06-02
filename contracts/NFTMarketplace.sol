// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    // Declared two variables
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    // The owner of the market place gets this amount
    uint256 listingPrice = 0.025 ether;

    // Owner
    address payable owner;

    // List of MarketItem fetched using the Item Id
    mapping(uint => MarketItem) private idToMarketItem;

    // Type of a data type with these properties
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // Event that can be triggered during code
    event MarketItemCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );


    // The one deploying the contact is the owner and therefore gets the amount
    constructor() {
        owner = payable(msg.sender);
    }

    function updateListingPrice (uint _listingPrice) public payable {
        require(owner == msg.sender, " Only marketplace owner can update the listing price");

        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
        
        // Incrementing the total tokenIds
        _tokenIds.increment();

        // Value of the recent tokenId (NFT_ID)
        uint256 newTokenId = _tokenIds.current();

        // Create or mint the UNIQUE token (NFT) with the tokenId (NFT_ID) for the SENDER
        _mint(msg.sender, newTokenId);

        // Create a unique identifier for the token (NFT) created
        _setTokenURI(newTokenId, tokenURI);

        // List the token (NFT) to the marketplace
        createMarketItem(newTokenId, price);

        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {

        // The price paying to market place should be greater than 0
        require(price > 0, "Price should be greater than 0");

        // The price paying to market place should be equal to the listing price as decided by the contract owner 
        require(msg.value == listingPrice , "Price should be equal to listingPrice");

        // Creating an entry for the specific tokenId (NFT_ID), owner is "this" contract
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        // initiate the transfer from the sender's address to "this" contract
        _transfer(msg.sender, address(this), tokenId);

        // Firing the event
        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
    }

    function resellToken(uint256 tokenId, uint256 price) public payabale {
        require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
        require(msg.value == listingPrice , "Price should be equal to listingPrice");

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));

        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }
}