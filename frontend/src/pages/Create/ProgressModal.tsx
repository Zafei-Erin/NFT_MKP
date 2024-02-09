import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

import { Spinner } from "@/assets";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/context/walletProvider";
import { CheckCircle2, CircleDotDashed } from "lucide-react";
import { useState } from "react";
import { formInputType } from ".";
import NFT from "../../../../smart_contract/artifacts/contracts/NFT.sol/NFT.json";
import NFTMarketPlace from "../../../../smart_contract/artifacts/contracts/NFTMarketplace.sol/NFTMarketPlace.json";

const JWT = import.meta.env.VITE_JWT;
const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;

type ProgressModalProps = {
  formInput: formInputType;
};

type ProgressStatus =
  | "init"
  | "uploadingImg"
  | "creatingItem"
  | "deployingItem"
  | "error";

const ErrorMessageMapping = {
  missingData:
    "Some data are missing. Please provide image and name for your NFT.",
  notConnected: "Please connect wallet and try again.",
  failed: "Something went wrong.",
};

export const ProgressModal: React.FC<ProgressModalProps> = ({ formInput }) => {
  const { accountAddr, connect, provider } = useWallet();
  const [staus, setStatus] = useState<ProgressStatus>("creatingItem");
  const [error, setError] = useState("");
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
      ownerAddress: "0x0000000000000000000000000000000000000000",
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
    const { name, img } = formInput;
    if (accountAddr === "" || !provider) {
      setStatus("error");
      setError(ErrorMessageMapping.notConnected);
      return;
    }

    if (!name || !img) {
      setStatus("error");
      setError(ErrorMessageMapping.missingData);
      return;
    }

    try {
      const fileUrl = await uploadImgToIpfs(img);
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
    } catch (error) {
      setStatus("error");
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(ErrorMessageMapping.failed);
      }
      console.log(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          //   variant="outline"
          onClick={mintNFT}
          className="mt-4 rounded-lg bg-sky-500 p-4 font-bold text-white shadow-lg"
        >
          Create Digital Asset
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg max-sm:w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {staus === "error" ? "Oops" : "Creating NFT"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <p>This process could take a while...</p>
            {staus === "error" ? (
              error
            ) : (
              <div className=" mt-3 space-y-4 text-base">
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
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {staus === "error" && error === ErrorMessageMapping.notConnected ? (
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={connect}>
              <div>Connect Wallet</div>
            </AlertDialogAction>
          </AlertDialogFooter>
        ) : (staus === "error" && error === ErrorMessageMapping.missingData) ||
          error === ErrorMessageMapping.failed ? (
          <AlertDialogFooter>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        ) : (
          <AlertDialogFooter>
            <AlertDialogAction disabled>
              <Spinner className="mr-2 h-4 w-4" />
              Creating
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
