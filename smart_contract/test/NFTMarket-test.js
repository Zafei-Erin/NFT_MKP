describe("NFTMarketplace", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarketPlace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    let auctionPrice = ethers.utils.parseUnits("1", "ether");

    // create nft token
    let tx1 = await nft.createToken("https://www.mytokenlocation.com");
    let tx2 = await nft.createToken("https://www.mytokenlocation2.com");

    // get tx1's tokenId
    tx1 = await tx1.wait();
    const event1 = tx1.events[0];
    const value1 = event1.args[2];
    const tokenId1 = value1.toNumber();

    // get tx2's tokenId
    tx2 = await tx2.wait();
    const event2 = tx2.events[0];
    const value2 = event2.args[2];
    const tokenId2 = value2.toNumber();

    // create 2 nfts in market
    await market.createMarketItem(nftContractAddress, tokenId1);
    await market.createMarketItem(nftContractAddress, tokenId2);

    // list 2 nfts in market
    await market.createMarketListing(
      nftContractAddress,
      tokenId1,
      auctionPrice,
      {
        value: listingPrice,
      }
    );
    await market.createMarketListing(
      nftContractAddress,
      tokenId2,
      auctionPrice,
      {
        value: listingPrice,
      }
    );

    // update price
    auctionPrice = ethers.utils.parseUnits("1.12", "ether");
    await market.changePrice(tokenId1, auctionPrice, {
      value: listingPrice,
    });

    // create a sale
    const [buyerAddress1, buyerAddress] = await ethers.getSigners();
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, tokenId1, { value: auctionPrice });

    await market.createMarketListing(
      nftContractAddress,
      tokenId1,
      auctionPrice,
      {
        value: listingPrice,
      }
    );

    // const tx = await nft.setApprovalForAll(buyerAddress1, true);
    // await tx.wait();

    // buy it back
    await market
      .connect(buyerAddress1)
      .createMarketSale(nftContractAddress, tokenId1, { value: auctionPrice });

    // cancel listing
    await market.cancelListing(tokenId2);

    let items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          itemId: i.itemId,
          tokenId: i.tokenId.toString(),
          creator: i.creator,
          owner: i.owner,
          price: i.price.toString(),
          listed: i.listed,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
});
