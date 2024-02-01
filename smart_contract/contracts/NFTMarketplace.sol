// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketPlace is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds; //token created

    address payable owner;
    uint256 listingPrice = 0.000001 ether;

    constructor() {
        // person that call this function
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        uint256 tokenId;
        address nftContract;
        address payable creator;
        address payable owner;
        uint256 price;
        bool listed;
    }

    // itemID => item
    mapping(uint256 => MarketItem) private idToMarketItem;

    // subscribe to this event, create a log to track when it is emitted
    // indexed is for filtering data
    event MarketItemCreated(
        uint indexed itemId,
        uint256 indexed tokenId,
        address indexed nftContract,
        address creator,
        address owner,
        uint256 price,
        bool listed 
    );

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(
        address nftContract, 
        uint256 tokenId
    ) public payable nonReentrant {
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        uint256 price = 0 ether;

        // add new item to market
        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId, // from nft
            nftContract,
            payable(msg.sender), // creator
            payable(address(0)), //owner, currently no one
            price, // price
            false //not listed by default
        );

        emit MarketItemCreated(
            itemId,
            tokenId,
            nftContract,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function createMarketListing(
        address nftContract, 
        uint256 tokenId,
        uint256 price
    )public payable nonReentrant{
        require(price > 0, "Price must be at least 1 wei");

        // creators pay the market for listing nfts
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        // update item listing status
        uint totalItemCount = _itemIds.current();
        uint itemId = 0;
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].tokenId == tokenId) {
                itemId = i+1;
            }
        }

        idToMarketItem[itemId].listed = true;
        idToMarketItem[itemId].price = price;

        // transfer the nft to market
        ERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        // transfer listing price to market
        payable(owner).transfer(listingPrice);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
        address nftContract,
        uint256 tokenId
    ) public payable nonReentrant {
        uint totalItemCount = _itemIds.current();
        uint itemId = 0;
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].tokenId == tokenId) {
                itemId = i+1;
            }
        }

        uint price = idToMarketItem[itemId].price;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        // transfer money to origin owner
        idToMarketItem[itemId].owner.transfer(msg.value);
        // transfer nft to buyer
        ERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].listed = false;
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
        }

    /* allows someone to update price of tokens they own*/
    function changePrice(uint256 tokenId, uint256 price) public payable {
        uint totalItemCount = _itemIds.current();
        uint itemId = 0;
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].tokenId == tokenId) {
                itemId = i+1;
            }
        }

        if (idToMarketItem[itemId].owner != payable(address(0))) {
            require(
                idToMarketItem[itemId].owner == msg.sender,
                "Only item owner can perform this operation"
            );
        } else {
            require(
                idToMarketItem[itemId].creator == msg.sender,
                "Only item owner can perform this operation"
            );
        }
        
        idToMarketItem[itemId].price = price;
    }

    function cancelListing(uint256 tokenId) public payable {
        uint totalItemCount = _itemIds.current();
        uint itemId = 0;
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].tokenId == tokenId) {
                itemId = i+1;
            }
        }

        if (idToMarketItem[itemId].owner != payable(address(0))) {
            require(
                idToMarketItem[itemId].owner == msg.sender,
                "Only item owner can perform this operation"
            );
        } else {
            require(
                idToMarketItem[itemId].creator == msg.sender,
                "Only item owner can perform this operation"
            );
        }
      
        idToMarketItem[itemId].listed = false;
    }

    // return all items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            MarketItem storage currentItem = idToMarketItem[i+1];
            items[i] = currentItem;
        }

        return items;
    }
}
