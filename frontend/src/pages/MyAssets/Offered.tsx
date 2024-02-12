import { useWallet } from "@/context/walletProvider";
import { Offer } from "@/types/types";
import { Link } from "react-router-dom";
import useSWR, { Fetcher } from "swr";
import { ListModal } from "../../components/ListModal";
import { UpdateListingModal } from "../../components/UpdateListingModal";
import { zeroAddr } from "@/constant";

const apiURL = import.meta.env.VITE_API_URL;

const fetcher: Fetcher<Offer[], string> = (url: string) =>
  fetch(url).then((data) => data.json());

export const Offered = () => {
  const { accountAddr } = useWallet();

  const { data: offers } = useSWR(
    `${apiURL}/user/${accountAddr}/offered`,
    fetcher,
    {
      suspense: true,
    },
  );

  if (!offers || !offers.length) {
    return <>no data</>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {offers.map((offer, index) => {
        const nft = offer.nft;
        console.log(offer, nft);
        return (
          <div
            key={index}
            className="group relative aspect-[2/3] overflow-hidden rounded-lg shadow-md hover:cursor-pointer"
          >
            <Link to={`/item/${nft.tokenId}}`}>
              <div className="h-full">
                <img src={nft.imageUrl} className="h-2/3 w-full object-cover" />
                <div className="flex flex-col items-start justify-center px-4 pb-6 pt-4">
                  <div className="mb-3 text-sm font-semibold">{nft.name}</div>
                  <div className="mb-2 text-sm font-semibold">
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
            {nft.ownerAddress.toLowerCase() !== accountAddr.toLowerCase() &&
            nft.ownerAddress.toLowerCase() !== zeroAddr ? (
              <button
                disabled
                className="absolute bottom-0 flex h-0 w-full items-center justify-center bg-gray-500 font-semibold text-transparent transition-all disabled:cursor-not-allowed group-hover:h-[2.8rem] group-hover:text-gray-100 "
              >
                Sold
              </button>
            ) : nft.listed ? (
              <UpdateListingModal tokenId={nft.tokenId}>
                <button className="absolute bottom-0 flex h-0 w-full items-center justify-center bg-blue-500 font-semibold text-transparent transition-all group-hover:h-[2.8rem] group-hover:text-gray-100 ">
                  Edit Lising
                </button>
              </UpdateListingModal>
            ) : (
              <ListModal tokenId={nft.tokenId}>
                <button className="absolute bottom-0 flex h-0 w-full items-center justify-center bg-blue-500 font-semibold text-transparent transition-all disabled:cursor-not-allowed disabled:bg-gray-600 group-hover:h-[2.8rem] group-hover:text-gray-100">
                  List now
                </button>
              </ListModal>
            )}
            {}
          </div>
        );
      })}
    </div>
  );
};
