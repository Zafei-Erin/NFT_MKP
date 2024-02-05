import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { NFT } from "@/types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PriceChart } from "./PriceChart";
import { OfferTable } from "./OfferTable";
import useSWR, { Fetcher } from "swr";
import { useParams } from "react-router-dom";
import { useWallet } from "@/context/walletProvider";
import { ethers } from "ethers";
import NFTMarketPlace from "../../../../smart_contract/artifacts/contracts/NFTMarketplace.sol/NFTMarketPlace.json";
import { useState } from "react";
import { BuyModal } from "./BuyModal";

const apiURL = import.meta.env.VITE_API_URL;
const nftmarketaddress = import.meta.env.VITE_MKP_ADDRESS;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;
const dataFetcher: Fetcher<NFT, string> = (url: string) =>
  fetch(url).then((data) => data.json());

export const Item = () => {
  const { provider, accountAddr } = useWallet();
  const { tokenId } = useParams();
  const { data: item } = useSWR(`${apiURL}/nfts/${tokenId}`, dataFetcher, {
    suspense: true,
  });
  const [loading, setLoading] = useState(false);

  const buyItemInMKP = async (provider: ethers.providers.Web3Provider) => {
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      NFTMarketPlace.abi,
      signer
    );

    const marketTxn = await marketContract.createMarketSale(
      nftaddress,
      item.tokenId,
      {
        value: ethers.utils.parseUnits(item.price.toString(), "ether"),
      }
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
      {item && (
        <div className="flex items-center justify-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-start p-8 max-w-screen-xl ">
            {/* first part */}
            <div className="space-y-10 flex flex-col items-start justify-start w-full">
              {/* header */}
              <div className="space-y-2">
                <h3 className="text-4xl font-semibold">{item.name}</h3>
                <p>
                  Owned by {item.ownerAddress.slice(0, 4)}...
                  {item.ownerAddress.slice(38)}
                </p>
              </div>
              {/* upload img input */}
              <div className="flex items-center justify-center relative aspect-square w-full">
                <label className="w-full h-full">
                  <img
                    className="absolute w-full h-full object-cover rounded-xl hover:shadow-2xl transition ease-in-out hover:-translate-y-1 duration-150"
                    src={item.imageUrl}
                    alt="imgPreview"
                  />
                </label>
              </div>
            </div>

            {/* second part */}
            <div className="flex flex-col justify-start w-full gap-8">
              <div>
                {item.listed ? (
                  <div className="flex flex-col items-start justify-start gap-3 w-full rounded-lg border p-6">
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="text-xl sm:text-3xl font-semibold">
                      {item.price} ETH
                    </div>
                    <BuyModal item={item} action={buyNFT}>
                      <button className="rounded-lg bg-sky-600 text-gray-100 font-semibold text-lg w-full py-2">
                        Buy
                      </button>
                    </BuyModal>
                  </div>
                ) : (
                  <div>
                    <div className="font-semibold text-lg pb-3">Offers</div>
                    <OfferTable offers={item.offers} />
                    <button className="rounded-lg bg-sky-600 text-gray-100 font-semibold text-lg w-full py-2">
                      Place Offer
                    </button>
                  </div>
                )}
              </div>
              <Accordion
                type="multiple"
                className="w-full border rounded-lg"
                defaultValue={["item-1"]}
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-6 data-[state=open]:border-b">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-6 max-h-36 overflow-y-auto">
                    {item.description}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-6 data-[state=open]:border-b">
                    Details
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-6">
                    <Table>
                      <TableRow className="border-b-0">
                        <TableHead>Contract Address</TableHead>
                        <TableCell>
                          {nftaddress.slice(0, 5)}...{nftaddress.slice(38)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-b-0">
                        <TableHead>Token ID</TableHead>
                        <TableCell>{item.tokenId}</TableCell>
                      </TableRow>
                      <TableRow className="border-b-0">
                        <TableHead>Token Standard</TableHead>
                        <TableCell>ERC-721</TableCell>
                      </TableRow>
                      <TableRow className="border-b-0">
                        <TableHead>Chain</TableHead>
                        <TableCell>Ethereum</TableCell>
                      </TableRow>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-0">
                  <AccordionTrigger className="px-6 data-[state=open]:border-b">
                    Price History
                  </AccordionTrigger>
                  <AccordionContent className="max-h-60 pb-0 overflow-y-auto">
                    {item.sales === undefined || item.sales.length === 0 ? (
                      <div className="px-6 py-6">no data</div>
                    ) : (
                      <PriceChart salesHistory={item.sales} />
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
