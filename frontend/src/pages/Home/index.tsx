import { GetNFTRequest } from "@zafei/nft_mkp_types";
import useSWR, { Fetcher } from "swr";

import { FetchWithParams, NFT } from "@/types";
import { CheapestNFTTable } from "./CheapestNFTTable";
import { ImgCarousel } from "./ImgCarousel";
import { NewestNFTTable } from "./NewestNFTTable";

const apiURL = import.meta.env.VITE_API_URL;
const fetcher: Fetcher<NFT[], FetchWithParams> = ({ url, params }) => {
  const newUrl = new URL(url);
  newUrl.search = new URLSearchParams(params).toString();
  return fetch(newUrl).then((data) => data.json());
};

export const Home = () => {
  const params: GetNFTRequest = {
    take: 6,
    skip: 0,
    sortBy: "tokenId",
    sortDir: "desc",
  };
  const { data: nfts } = useSWR(
    { url: `${apiURL}/nfts`, params: params },
    fetcher,
    {
      suspense: true,
    },
  );

  return (
    <div className="flex flex-col items-start justify-center space-y-16 pb-16">
      <ImgCarousel nfts={nfts} />
      <div className="flex w-full flex-col items-start justify-center gap-10 overflow-x-auto px-10 md:grid md:grid-flow-col md:justify-stretch">
        <NewestNFTTable nfts={nfts.slice(0, 4)} />
        <CheapestNFTTable />
      </div>
    </div>
  );
};
