import { useWallet } from "@/context/walletProvider";
import { NFT as NFTType } from "@/types/types";
import { ethers } from "ethers";
import { useState } from "react";
import NFTMarketPlace from "../../../smart_contract/artifacts/contracts/NFTMarketplace.sol/NFTMarketPlace.json";
import NFT from "../../../smart_contract/artifacts/contracts/NFT.sol/NFT.json";
import axios from "axios";

const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;

export const TestButton = () => {
  const { provider } = useWallet();
  const [items, setItems] = useState<NFTType[]>();

  const getItems = async () => {
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      NFTMarketPlace.abi,
      provider?.getSigner()
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMarketItems();

    const items: NFTType[] = await Promise.all(
      data.map(async (i) => {
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const item = {
          tokenId: i.tokenId.toNumber(),
          price: price,
          listed: i.listed,
          creator: i.creator,
          owner: i.owner,
          imgURL: meta.data.image,
        };
        return item;
      })
    );
    console.log(items);
    setItems(items);
  };

  return (
    <div>
      <button onClick={getItems}>test</button>
      {items && items.length ? (
        items.map((item, index) => (
          <div key={index}>{JSON.stringify(item)}</div>
        ))
      ) : (
        <div>nothing here now</div>
      )}
    </div>
  );
};
