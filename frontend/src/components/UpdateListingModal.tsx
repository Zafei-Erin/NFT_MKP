import { ethers } from "ethers";
import { ReactNode, useEffect, useState } from "react";
import useSWR, { Fetcher } from "swr";

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
  DialogOverlay,
} from "@/components/ui/dialog";
import { useWallet } from "@/context/walletProvider";
import { NFT } from "@/types/types";
import NFTMarketPlace from "@/constant/NFTMarketPlace.json";
import { useNetwork } from "@/context/networkProvider/networkProvider";

type ListModalProps = {
  tokenId: number;
  children: ReactNode;
};
type Params = NFT & { userAddr: string };
type FetcherWithBody = {
  url: string;
  body: Params;
};
type status = "Init" | "Canceling" | "Changing" | "Error";

const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const api = import.meta.env.VITE_API_URL;

export const UpdateListingModal: React.FC<ListModalProps> = ({
  tokenId,
  children,
}) => {
  const { accountAddr, provider, connect } = useWallet();
  const { getNetwork } = useNetwork();
  const [price, setPrice] = useState<number>(0);
  const [staus, setStatus] = useState<status>("Init");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [params, setParams] = useState<Partial<Params>>();
  const [continueDisabled, setContinueDisabled] = useState(false);
  const [cancelDisabled, setCancelDisabled] = useState(false);

  useEffect(() => {
    check();
    async function check() {
      const isTestnet = await getNetwork();
      if (!isTestnet.success || !accountAddr || price <= 0 || !price) {
        setContinueDisabled(true);
      } else {
        setContinueDisabled(false);
      }

      if (!isTestnet.success || !accountAddr) {
        setCancelDisabled(true);
      } else {
        setCancelDisabled(false);
      }
    }
  });

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
        signer,
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
    setParams({ userAddr: accountAddr, price: price });
    if (!provider) {
      connect();
      return;
    }

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        nftmarketaddress,
        NFTMarketPlace.abi,
        signer,
      );

      const priceEth = ethers.utils.parseUnits(price.toString(), "ether");
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
    { suspense: true },
  );

  if (nft && !isLoading) {
    window.location.reload();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogOverlay className="bg-black/10" />
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
            className="flex flex-col items-start justify-center gap-4 text-center"
          >
            <div className="font-semibold">Set new price</div>
            <div className="col-span-3 flex w-full items-center justify-between rounded-lg border p-3">
              <input
                id="price"
                required
                type="number"
                onChange={(e) => setPrice(e.target.valueAsNumber)}
                placeholder="0.00 "
                className="text-md h-fit appearance-none text-zinc-500 placeholder:text-zinc-500 focus:outline-none"
              />
              <p>ETH</p>
            </div>
          </label>
        </div>
        <DialogFooter className="mt-6 grid w-full grid-cols-2">
          <Button
            onClick={cancelListing}
            variant={"destructive"}
            disabled={staus === "Canceling" || cancelDisabled}
            className="disabled:cursor-not-allowed"
          >
            {staus === "Canceling" && <Spinner className="mr-1 h-6 w-6" />}
            Cancel listing
          </Button>

          <Button
            onClick={changePrice}
            disabled={staus === "Changing" || continueDisabled}
            className="disabled:cursor-not-allowed"
          >
            {staus === "Changing" && <Spinner className="mr-1 h-6 w-6" />}
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
