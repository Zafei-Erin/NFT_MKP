import axios from "axios";
import { ethers } from "ethers";
import { decodeError } from "ethers-decode-error";
import { CheckCircle2, CircleDotDashed, XCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Spinner } from "@/assets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { zeroAddr } from "@/constant";
import NFT from "@/constant/NFT.json";
import NFTMarketPlace from "@/constant/NFTMarketPlace.json";
import { useWallet } from "@/context/walletProvider";
import { formInputType } from ".";

const JWT = import.meta.env.VITE_JWT;
const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;

type ProgressModalProps = {
  children?: ReactNode | undefined;
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void | undefined;
  formInput: formInputType;
  setIsCreating?: (creating: boolean) => void | undefined;
};

type ProgressStatus =
  | "init"
  | "uploadingImg"
  | "creatingItem"
  | "deployingItem";

export const CreateModal: React.FC<ProgressModalProps> = ({
  children,
  formInput,
  open,
  onOpenChange,
  setIsCreating,
}) => {
  const { accountAddr, provider } = useWallet();
  const [staus, setStatus] = useState<ProgressStatus>("init");
  const navigate = useNavigate();
  const { toast } = useToast();

  // upload img to ipfs
  const uploadImgToIpfs = async (img: File) => {
    setStatus("uploadingImg");
    const formData = new FormData();
    formData.append("file", img);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: `Bearer ${JWT}`,
        },
      },
    );
    const url = `https://peach-top-whippet-722.mypinata.cloud/ipfs/${res.data.IpfsHash}`;
    return url;
  };

  // upload nft to ipfs
  async function createURI(fileUrl: string) {
    const { name, description } = formInput;
    const file = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    const blob = new Blob([file], {
      type: "application/json",
    });

    const formData = new FormData();
    formData.append("file", blob);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data`,
          Authorization: `Bearer ${JWT}`,
        },
      },
    );
    const url = `https://peach-top-whippet-722.mypinata.cloud/ipfs/${res.data.IpfsHash}`;
    return url;
  }

  // create nft and store to market place
  async function createItem(
    uri: string,
    provider: ethers.providers.Web3Provider,
  ) {
    setStatus("creatingItem");
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
    const nftTxn = await nftContract.createToken(uri);
    const tx = await nftTxn.wait();
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    setStatus("deployingItem");
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      NFTMarketPlace.abi,
      signer,
    );
    const marketTxn = await marketContract.createMarketItem(
      nftaddress,
      tokenId,
    );
    await marketTxn.wait();

    return { tokenId };
  }

  // store info to db
  const createItemDB = async (
    uri: string,
    fileUrl: string,
    tokenId: string,
    creatorAddress: string,
  ) => {
    const newNft = {
      tokenId: tokenId,
      uri: uri,
      name: formInput.name,
      description: formInput.description,
      imageUrl: fileUrl,
      price: 0.0,
      listed: false,
      ownerAddress: zeroAddr,
      creatorAddress: creatorAddress,
    };
    const apiURL = "http://localhost:4000";
    const response = await fetch(`${apiURL}/nfts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNft),
    });
    const data = await response.json();
    return data.id;
  };

  const mintNFT = async () => {
    if (!provider || !formInput.img) {
      return;
    }

    setIsCreating?.(true);

    try {
      const fileUrl = await uploadImgToIpfs(formInput.img);
      const uri = await createURI(fileUrl);
      const { tokenId } = await createItem(uri, provider);
      await createItemDB(uri, fileUrl, tokenId, accountAddr);

      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Success
          </div>
        ),
        description: "Your NFT is created!",
      });
      navigate(`/item/${tokenId}`);
    } catch (e) {
      const { error } = decodeError(e);
      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <XCircle className="h-5 w-5 text-red-600" />
            Failed to connect wallet
          </div>
        ),
        description: error,
      });
    } finally {
      setStatus("init");
      onOpenChange?.(false);
      setIsCreating?.(false);
    }
  };

  useEffect(() => {
    if (open) {
      mintNFT();
    }
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="bg-black/10" />
      <AlertDialogContent className="overflow-auto rounded-lg max-sm:w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Creating NFT</AlertDialogTitle>
          <div>
            <p className="text-sm text-gray-500">
              This process could take a while...
            </p>
            <div className="mt-3 space-y-4 text-base text-gray-500">
              <div className="flex items-center justify-start gap-2">
                {staus === "uploadingImg" ? (
                  <Spinner className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="ml-0.5 h-5 w-5 text-sky-600" />
                )}
                <p>Uploading image</p>
              </div>
              <div className="flex items-center justify-start gap-2">
                {staus === "uploadingImg" ? (
                  <CircleDotDashed className="ml-0.5 h-5 w-5 text-sky-600" />
                ) : staus === "creatingItem" ? (
                  <Spinner className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="ml-0.5 h-5 w-5 text-sky-600" />
                )}
                <p>Creating NFT</p>
              </div>
              <div className="flex items-center justify-start gap-2">
                {["uploadingImg", "creatingItem"].includes(staus) ? (
                  <CircleDotDashed className="ml-0.5 h-5 w-5 text-sky-600" />
                ) : staus === "deployingItem" ? (
                  <Spinner className="h-6 w-6" />
                ) : (
                  <CheckCircle2 className="ml-0.5 h-5 w-5 text-sky-600" />
                )}
                <p>Deploying NFT to market place</p>
              </div>
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction disabled>
            <Spinner className="mr-2 h-4 w-4" />
            Creating
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
