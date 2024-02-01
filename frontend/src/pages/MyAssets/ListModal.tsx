import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWallet } from "@/context/walletProvider";
import { NFT } from "@/types/types";
import { ethers } from "ethers";
import { useState } from "react";
import useSWR, { Fetcher } from "swr";

import NFTMarketPlace from "../../../../smart_contract/artifacts/contracts/NFTMarketplace.sol/NFTMarketPlace.json";

type ListModalProps = {
  tokenId: number;
};

const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const api = import.meta.env.VITE_API_URL;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;

export const ListModal: React.FC<ListModalProps> = ({ tokenId }) => {
  const { accountAddr, provider, connect } = useWallet();
  const [price, setPrice] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);

  // list create in market
  const listItem = async () => {
    if (!accountAddr || !provider) {
      connect();
      return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftmarketaddress,
      NFTMarketPlace.abi,
      signer
    );
    const listingPrice = await contract.getListingPrice();
    const priceEth = ethers.utils.parseUnits(price, "ether");
    const transaction = await contract.createMarketListing(
      nftaddress,
      tokenId,
      priceEth,
      {
        value: listingPrice,
      }
    );
    await transaction.wait();
    setShouldUpdate(true);
  };

  // update database
  const params = { userAddr: accountAddr, price: price, listed: true };
  const fetcher: Fetcher<NFT, string> = async (url: string) =>
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    }).then((data) => data.json());

  const { data: nft, isLoading } = useSWR(
    shouldUpdate ? `${api}/nfts/${tokenId}` : null,
    fetcher,
    { suspense: true }
  );

  if (nft && !isLoading) {
    window.location.reload();
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group-hover:h-[2.8rem] font-semibold transition-all h-0 absolute bottom-0 flex items-center justify-center bg-blue-500 text-transparent group-hover:text-gray-100 w-full disabled:bg-gray-600 disabled:cursor-not-allowed">
          List now
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Listing NFT</DialogTitle>
          <DialogDescription>
            Listing this NFT to market. Click continue when you're done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <label
            htmlFor="price"
            className="text-center grid grid-cols-4 items-center gap-4"
          >
            Price:
            <div className="col-span-3 rounded-lg border p-3 flex items-center justify-between">
              <input
                id="price"
                required
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00 "
                className="text-md text-zinc-500 placeholder:text-zinc-500 h-fit appearance-none focus:outline-none"
              />
              <p>ETH</p>
            </div>
          </label>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={listItem}>Continue</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
