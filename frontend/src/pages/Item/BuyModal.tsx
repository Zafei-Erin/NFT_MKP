import { ethers } from "ethers";
import { decodeError } from "ethers-decode-error";
import { ReactNode, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { NFT } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import NFTMarketPlace from "@/constant/NFTMarketPlace.json";
import { useNetwork } from "@/context/networkProvider/networkProvider";
import { useWallet } from "@/context/walletProvider";

type BuyModalProps = {
  item: NFT;
  setBuying: (props: boolean) => void;
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void | undefined;
  children?: ReactNode | undefined;
};

const apiURL = import.meta.env.VITE_API_URL;
const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;

export const BuyModal: React.FC<BuyModalProps> = ({
  open,
  onOpenChange,
  children,
  item,
  setBuying,
}) => {
  const { provider, accountAddr } = useWallet();
  const { getNetwork } = useNetwork();
  const [disabled, setDisabled] = useState<boolean>();

  useEffect(() => {
    check();

    async function check() {
      const isTestnet = await getNetwork();
      if (!isTestnet.success || !provider || !accountAddr) {
        setDisabled(true);
        return;
      }
      setDisabled(false);
    }
  }, [getNetwork, accountAddr, provider]);

  const { toast } = useToast();
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

  const buyNFT = async () => {
    setBuying(true);
    if (!provider) {
      return;
    }
    try {
      await buyItemInMKP(provider);
      await updateDB();
      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Buy NFT Successfully!
          </div>
        ),
        description: "Your purchase is created!",
      });
      window.location.reload();
    } catch (e) {
      let msg = "";

      const { error } = decodeError(e);
      if (error !== "Internal JSON-RPC error.") {
        if (error.includes("incorrect owner")) {
          msg = "Sorry, we don't support resell currently.";
        } else {
          msg = error;
        }
      } else {
        //@ts-expect-error e may not have message inside
        if (e.data.message.includes("insufficient funds")) {
          msg =
            "You don't have sufficient funds for this transaction. Follow the instruction in header to get some free tokens!";
        }
      }

      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <XCircle className="h-5 w-5 text-red-600" />
            Failed to Buy NFT:
          </div>
        ),
        description: msg,
      });
    } finally {
      setBuying(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="bg-black/10" />
      <AlertDialogContent className=" overflow-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Review your purchase</AlertDialogTitle>
          <Table>
            <TableBody>
              <TableRow className="border-b-0">
                <TableHead>Collection name</TableHead>
                <TableCell>{item.name}</TableCell>
              </TableRow>
              <TableRow className="border-b-0">
                <TableHead>Creator</TableHead>
                <TableCell className="overflow break-words">
                  {item.creatorAddress}
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0">
                <TableHead>Total sales</TableHead>
                <TableCell>
                  {item.sales.length.toLocaleString()} sales
                </TableCell>
              </TableRow>
              <TableRow className="border-b-0">
                <TableHead>Price</TableHead>
                <TableCell>{item.price}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={disabled} onClick={buyNFT}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>

        <></>
      </AlertDialogContent>
    </AlertDialog>
  );
};
