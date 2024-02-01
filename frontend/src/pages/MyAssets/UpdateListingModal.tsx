import { Spinner } from "@/assets";
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
import { NFT } from "@/types/types";
import { ethers } from "ethers";
import { useState } from "react";
import useSWR, { Fetcher } from "swr";

import NFTMarketPlace from "../../../../smart_contract/artifacts/contracts/NFTMarketplace.sol/NFTMarketPlace.json";

type ListModalProps = {
  tokenId: number;
};
type Params = NFT & { userAddr: string };
type FetcherWithBody = {
  url: string;
  body: Params;
};
type status = "Init" | "Canceling" | "Changing" | "Error";

const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const api = import.meta.env.VITE_API_URL;

export const UpdateListingModal: React.FC<ListModalProps> = ({ tokenId }) => {
  const { accountAddr, provider, connect } = useWallet();
  const [price, setPrice] = useState("");
  const [staus, setStatus] = useState<status>("Init");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [params, setParams] = useState<Partial<Params>>();

  const cancelListing = async () => {
    setStatus("Canceling");
    setParams({ userAddr: accountAddr, listed: false });
    if (!provider) {
      connect();
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        NFTMarketPlace.abi,
        signer
      );

      const transaction = await contract.cancelListing(tokenId);
      await transaction.wait();
      setShouldUpdate(true);
    } catch (error) {
      setStatus("Error");
      console.log(error);
    }
  };

  // list create in market
  const changePrice = async () => {
    setStatus("Changing");
    setParams({ userAddr: accountAddr, price: parseFloat(price) });
    if (!provider) {
      connect();
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        NFTMarketPlace.abi,
        signer
      );

      const priceEth = ethers.utils.parseUnits(price, "ether");
      const transaction = await contract.changePrice(tokenId, priceEth);
      await transaction.wait();
      setShouldUpdate(true);
    } catch (error) {
      setStatus("Error");
      console.log(error);
    }
  };

  const fetcher: Fetcher<NFT, FetcherWithBody> = async ({ url, body }) =>
    fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((data) => data.json());

  const { data: nft, isLoading } = useSWR(
    shouldUpdate ? { url: `${api}/nfts/${tokenId}`, body: params } : null,
    fetcher,
    { suspense: true }
  );

  if (nft && !isLoading) {
    console.log(window.location);
    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="group-hover:h-[2.8rem] font-semibold transition-all h-0 absolute bottom-0 flex items-center justify-center bg-blue-500 text-transparent group-hover:text-gray-100 w-full ">
          Edit Lising
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit listing</DialogTitle>
          <DialogDescription>
            Changing listing price will cost gas.
          </DialogDescription>
        </DialogHeader>
        <div>
          <label
            htmlFor="price"
            className="text-center flex flex-col items-start justify-center gap-4"
          >
            <div className="font-semibold">Set new price</div>
            <div className="col-span-3 rounded-lg border p-3 w-full flex items-center justify-between">
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
        <DialogFooter className="w-full grid grid-cols-2 mt-6">
          <Button onClick={cancelListing} variant={"destructive"}>
            {staus === "Canceling" && <Spinner className="w-6 h-6 mr-1" />}
            Cancel listing
          </Button>

          <Button onClick={changePrice}>
            {staus === "Changing" && <Spinner className="w-6 h-6 mr-1" />}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
