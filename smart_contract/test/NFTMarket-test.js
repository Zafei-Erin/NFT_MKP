describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarketPlace");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    let listingPrice = await market.getListingPrice();
    let auctionPrice = ethers.utils.parseUnits("1", "ether");

    // create nft token
    let tx1 = await market.createToken("https://www.mytokenlocation.com");
    let tx2 = await market.createToken("https://www.mytokenlocation2.com");

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

    // list 2 nfts in market
    await market.createMarketListing(
      tokenId1,
      auctionPrice,
    );
    await market.createMarketListing(
      tokenId2,
      auctionPrice,
    );

    // update price
    auctionPrice = ethers.utils.parseUnits("1.12", "ether");
    await market.changePrice(tokenId1, auctionPrice);

    // cancel listing
    await market.cancelListing(tokenId2); 

    // create a sale
    const [_, buyerAddress] = await ethers.getSigners();
    await market
      .connect(buyerAddress)
      .createMarketSale(tokenId1, { value: auctionPrice });


    let items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await market.tokenURI(i.tokenId);
        let item = {
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
