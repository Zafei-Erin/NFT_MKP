import { NFT } from "@/types/types";
import useSWR, { Fetcher } from "swr";
import { ImgCarousel } from "./ImgCarousel";
import { NewestNFTTable } from "./NewestNFTTable";
import { CheapestNFTTable } from "./CheapestNFTTable";

export type FetchRequest = {
  url: string;
  params: Record<string, string>;
};

const apiURL = import.meta.env.VITE_API_URL;
const fetcher: Fetcher<NFT[], FetchRequest> = ({ url, params }) => {
  const newUrl = new URL(url);
  newUrl.search = new URLSearchParams(params).toString();
  return fetch(newUrl).then((data) => data.json());
};

export const Home = () => {
  // todo: fetch top 10
  const params = {
    offset: 6,
    skip: 0,
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
        <NewestNFTTable nfts={nfts} />
        <CheapestNFTTable />
      </div>
    </div>
  );
};
