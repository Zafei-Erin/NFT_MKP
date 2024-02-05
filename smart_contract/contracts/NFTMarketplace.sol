// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketPlace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 listingPrice = 0.000001 ether;
    address payable owner;

    // tokenId => item
    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable creator;
        address payable owner;
        uint256 price;
        bool listed;
    }

    // subscribe to this event, create a log to track when it is emitted
    // indexed is for filtering data
    event MarketItemCreated(
        uint256 indexed tokenId,
        address creator,
        address owner,
        uint256 price,
        bool listed 
    );

    constructor() ERC721("Metaverse Tokens", "METT") {
        // person that call this function
        owner = payable(msg.sender);
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    function createToken(string memory tokenURI) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        // should be ipfs uri
        _setTokenURI(newTokenId, tokenURI);
        // setApprovalForAll(contractAddress, true);
        createMarketItem(newTokenId);
        return newTokenId;
    }

    function createMarketItem(
        uint256 tokenId
    ) private {
        uint256 price = 0 ether;
        // add new item to market
        idToMarketItem[tokenId] = MarketItem(
            tokenId, // from nft
            payable(msg.sender), // creator
            payable(msg.sender), // owner
            price, // price
            false //not listed by default
        );

        emit MarketItemCreated(
            tokenId,
            msg.sender,
            msg.sender,
            price,
            false
        );
    }

    function createMarketListing(
        uint256 tokenId,
        uint256 price
    )public payable{
        require(price > 0, "Price must be at least 1 wei");
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );

        // update item listing status
        idToMarketItem[tokenId].listed = true;
        idToMarketItem[tokenId].price = price;

        // transfer the nft to market
        _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
        uint256 tokenId
    ) public payable {
        uint price = idToMarketItem[tokenId].price;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        // transfer nft to buyer
        _transfer(address(this), msg.sender, tokenId);
        // transfer listing fee to owner of market place
        payable(owner).transfer(listingPrice);
        // transfer money to origin owner
        // address seller = idToMarketItem[tokenId].owner;
        // payable(seller).transfer(msg.value);
        idToMarketItem[tokenId].owner.transfer(msg.value);

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].listed = false;
    }

    /* allows someone to update price of tokens they own*/
    function changePrice(uint256 tokenId, uint256 price) public {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
       
        idToMarketItem[tokenId].price = price;
    }

    function cancelListing(uint256 tokenId) public {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
      
        idToMarketItem[tokenId].listed = false;
    }

    // return all items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds.current();

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            MarketItem storage currentItem = idToMarketItem[i+1];
            items[i] = currentItem;
        }

        return items;
    }
}
