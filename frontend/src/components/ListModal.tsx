import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWallet } from "@/context/walletProvider";
import { ethers } from "ethers";
import { ReactNode, useState } from "react";

import { Spinner } from "@/assets";
import NFTMarketPlace from "@/constant/NFTMarketPlace.json";

type ListModalProps = {
  tokenId: number;
  children: ReactNode;
};

const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const api = import.meta.env.VITE_API_URL;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;

export const ListModal: React.FC<ListModalProps> = ({ tokenId, children }) => {
  const { accountAddr, provider, connect } = useWallet();
  const [price, setPrice] = useState("");
  const [listing, setListing] = useState(false);

  // list create in market
  const listItem = async () => {
    if (!accountAddr || !provider) {
      connect();
      return;
    }
    try {
      setListing(true);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        NFTMarketPlace.abi,
        signer,
      );
      const listingPrice = await contract.getListingPrice();
      const priceEth = ethers.utils.parseUnits(price, "ether");
      const transaction = await contract.createMarketListing(
        nftaddress,
        tokenId,
        priceEth,
        {
          value: listingPrice,
        },
      );
      await transaction.wait();
      updateDB();
      setListing(false);
    } catch (error) {
      console.log(error);
    }
  };

  // update database
  const params = { userAddr: accountAddr, price: price, listed: true };

  const updateDB = async () => {
    await fetch(`${api}/nfts/${tokenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    window.location.reload();
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
            className="grid grid-cols-4 items-center gap-4 text-center"
          >
            Price:
            <div className="col-span-3 flex items-center justify-between rounded-lg border p-3">
              <input
                id="price"
                required
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00 "
                className="text-md h-fit appearance-none text-zinc-500 placeholder:text-zinc-500 focus:outline-none"
              />
              <p>ETH</p>
            </div>
          </label>
        </div>
        <DialogFooter>
          {listing ? (
            <Button
              disabled
              className="flex items-center justify-center gap-1 disabled:cursor-not-allowed"
            >
              <Spinner className="h-4 w-4" />
              <div>Listing...</div>
            </Button>
          ) : (
            <Button onClick={listItem}>Continue</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
