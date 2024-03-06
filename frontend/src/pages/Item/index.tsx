import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { useWallet } from "@/context/walletProvider";
import { isCurrentOwner } from "@/lib/utils";
import { NFT } from "@/types/types";
import { Pencil } from "lucide-react";
import { useParams } from "react-router-dom";
import useSWR, { Fetcher } from "swr";
import { BuyerSection } from "./BuyerSection";
import { EditDescriptionModal } from "./EditDescriptionModal";
import { OfferTable } from "./OfferTable";
import { OwnerSection } from "./OwnerSection";
import { PriceChart } from "./PriceChart";
import { Suspense } from "react";
import { Loader } from "@/assets";

const apiURL = import.meta.env.VITE_API_URL;
const nftaddress = import.meta.env.VITE_NFT_ADDRESS;
const dataFetcher: Fetcher<NFT, string> = (url: string) =>
  fetch(url).then((data) => data.json());

export const Item = () => {
  const { accountAddr } = useWallet();
  const { tokenId } = useParams();
  const { data: item } = useSWR(`${apiURL}/nfts/${tokenId}`, dataFetcher, {
    suspense: true,
  });
  const isOwner = isCurrentOwner(
    item.ownerAddress,
    item.creatorAddress,
    accountAddr,
  );

  return (
    <div>
      {item && (
        <div className="flex items-center justify-center">
          <div className="grid w-full max-w-screen-xl grid-cols-1 justify-items-start gap-10 p-8 md:grid-cols-2 ">
            {/* first part */}
            <div className="flex w-full flex-col items-start justify-start space-y-10">
              {/* header */}
              <div className="space-y-2">
                <h3 className="text-4xl font-semibold">{item.name}</h3>
                <p>
                  Created by {item.creatorAddress.slice(0, 4)}...
                  {item.creatorAddress.slice(38)}
                </p>
              </div>
              {/* upload img input */}
              <div className="relative flex aspect-square w-full items-center justify-center">
                <label className="h-full w-full">
                  <img
                    className="absolute h-full w-full rounded-xl object-cover transition duration-150 ease-in-out hover:-translate-y-1 hover:shadow-2xl"
                    src={item.imageUrl}
                    alt="imgPreview"
                  />
                </label>
              </div>
            </div>

            {/* second part */}
            <div className="flex w-full flex-col justify-start gap-8">
              <div>
                {isOwner ? (
                  <OwnerSection item={item} />
                ) : (
                  <BuyerSection item={item} />
                )}
              </div>
              <div>
                <div className="text-lg font-semibold">Offers</div>
                <Suspense
                  fallback={
                    <div className="flex h-60 items-center justify-center rounded-lg border">
                      <Loader className="w-16 stroke-sky-600" />
                    </div>
                  }
                >
                  <OfferTable nftId={item.tokenId} />
                </Suspense>
              </div>
              <Accordion
                type="multiple"
                className="w-full rounded-lg border"
                defaultValue={["item-1"]}
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-6 data-[state=open]:border-b">
                    <div className="flex items-center justify-start gap-2">
                      Description
                      {isOwner && (
                        <EditDescriptionModal
                          tokenId={item.tokenId}
                          description={item.description}
                        >
                          <Pencil className="h-4 w-4 stroke-gray-500 hover:cursor-pointer hover:stroke-gray-900" />
                        </EditDescriptionModal>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="max-h-36 overflow-y-auto whitespace-pre-line px-6 py-6">
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
                  <AccordionContent className="max-h-60 overflow-y-auto pb-0">
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
