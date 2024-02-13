import { NFT } from "@/types/types";
import { BuyModal } from "./BuyModal";
import { OfferTable } from "./OfferTable";
import { ethers } from "ethers";

import NFTMarketPlace from "../../../../smart_contract/artifacts/contracts/NFTMarketplace.sol/NFTMarketPlace.json";
import { useWallet } from "@/context/walletProvider";
import { useState } from "react";
import { OfferModal } from "./OfferModal";

type BuyerSectionProps = {
  item: NFT;
};

const apiURL = import.meta.env.VITE_API_URL;
const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;

export const BuyerSection: React.FC<BuyerSectionProps> = ({ item }) => {
  const [loading, setLoading] = useState(false);
  const { provider, accountAddr } = useWallet();
  const buyItemInMKP = async (provider: ethers.providers.Web3Provider) => {
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      NFTMarketPlace.abi,
      signer,
    );

    const marketTxn = await marketContract.createMarketSale(
      nftaddress,
      item.tokenId,
      {
        value: ethers.utils.parseUnits(item.price.toString(), "ether"),
      },
    );
    await marketTxn.wait();
  };
  const params = {
    ownerAddr: accountAddr,
    date: Date.now(),
    price: item ? item.price : 0,
  };

  const updateDB = async () => {
    fetch(`${apiURL}/nfts/buy/${item.tokenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  };

  const buyNFT = () => {
    if (!provider || !accountAddr) {
      console.log("please connect wallet");
      return;
    }
    setLoading(true);
    buyItemInMKP(provider);
    updateDB();
    setLoading(false);
  };

  return (
    <div>
      {item.listed ? (
        <div className="flex w-full flex-col items-start justify-start gap-3 rounded-lg border p-6">
          <div className="text-sm text-gray-600">Price</div>
          <div className="text-xl font-semibold sm:text-3xl">
            {item.price} ETH
          </div>
          <BuyModal item={item} action={buyNFT}>
            <button className="w-full rounded-lg bg-sky-600 py-2 text-lg font-semibold text-gray-100">
              Buy
            </button>
          </BuyModal>
        </div>
      ) : (
        <div>
          <div className="pb-3 text-lg font-semibold">Offers</div>
          <OfferTable offers={item.offers} />
          <OfferModal tokenId={item.tokenId}>
            <button className="w-full rounded-lg bg-sky-600 py-2 text-lg font-semibold text-gray-100">
              Place Offer
            </button>
          </OfferModal>
        </div>
      )}
    </div>
  );
};
