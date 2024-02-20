import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { NFT } from "@/types/types";
import { ethers } from "ethers";
import { ReactNode } from "react";

import { useWallet } from "@/context/walletProvider";
import NFTMarketPlace from "@/constant/NFTMarketPlace.json";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2 } from "lucide-react";

type BuyModalProps = {
  item: NFT;
  children: ReactNode;
};

const apiURL = import.meta.env.VITE_API_URL;
const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;

export const BuyModal: React.FC<BuyModalProps> = ({ children, item }) => {
  const { provider, accountAddr } = useWallet();
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
    if (!provider || !accountAddr) {
      console.log("please connect wallet");
      return;
    }

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
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
          <AlertDialogAction onClick={buyNFT}>Continue</AlertDialogAction>
        </AlertDialogFooter>

        <></>
      </AlertDialogContent>
    </AlertDialog>
  );
};
