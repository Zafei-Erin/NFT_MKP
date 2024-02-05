import { useWallet } from "@/context/walletProvider";
import { NFT } from "@/types/types";
import { Link } from "react-router-dom";
import useSWR, { Fetcher } from "swr";
import { ListModal } from "./ListModal";
import { UpdateListingModal } from "./UpdateListingModal";

const apiURL = import.meta.env.VITE_API_URL;

const fetcher: Fetcher<NFT[], string> = (url: string) =>
  fetch(url).then((data) => data.json());

export const Created = () => {
  const { accountAddr } = useWallet();

  const { data: nfts } = useSWR(
    `${apiURL}/user/${accountAddr}/created`,
    fetcher,
    {
      suspense: true,
    }
  );

  if (!nfts || !nfts.length) {
    return <>no data</>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-4">
      {nfts.map((nft) => {
        return (
          <div
            key={nft.id}
            className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:cursor-pointer"
          >
            <Link to={`/item/${nft.tokenId}`}>
              <div className="h-full">
                <img src={nft.imageUrl} className="w-full h-2/3 object-cover" />
                <div className="px-4 pb-6 pt-4 flex flex-col items-start justify-center">
                  <div className="font-semibold text-sm mb-3">{nft.name}</div>
                  <div className="font-semibold text-sm mb-2">
                    {nft.listed ? "price: " + nft.price : "not listed"}
                  </div>
                  <div className="text-xs text-gray-700">
                    {nft.sales &&
                      `Last
                    sale: ${nft.sales[nft.sales.length - 1].price} ETH`}
                  </div>
                </div>
              </div>
            </Link>
            {nft.ownerAddress.toLowerCase() !== accountAddr.toLowerCase() ? (
              <button
                disabled
                className="group-hover:h-[2.8rem] font-semibold transition-all h-0 absolute bottom-0 flex items-center justify-center bg-gray-500 disabled:cursor-not-allowed text-transparent group-hover:text-gray-100 w-full "
              >
                Sold
              </button>
            ) : nft.listed ? (
              <UpdateListingModal tokenId={nft.tokenId} />
            ) : (
              <ListModal tokenId={nft.tokenId} />
            )}
            {}
          </div>
        );
      })}
    </div>
  );
};
