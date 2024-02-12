import { ListModal } from "@/components/ListModal";
import { UpdateListingModal } from "@/components/UpdateListingModal";
import { OfferTable } from "./OfferTable";
import { NFT } from "@/types/types";

type OwnerSectionProps = {
  item: NFT;
};

export const OwnerSection: React.FC<OwnerSectionProps> = ({ item }) => {
  return (
    <div>
      {item.listed ? (
        <div className="flex w-full flex-col items-start justify-start gap-3 rounded-lg border p-6">
          <div className="text-sm text-gray-600">Price</div>
          <div className="text-xl font-semibold sm:text-3xl">
            {item.price} ETH
          </div>
          <UpdateListingModal tokenId={item.tokenId}>
            <button className="w-full rounded-lg bg-sky-600 py-2 text-lg font-semibold text-gray-100">
              Edit Listing
            </button>
          </UpdateListingModal>
        </div>
      ) : (
        <div className="">
          <div className="pb-3 text-lg font-semibold">Offers</div>
          <OfferTable offers={item.offers}/>
          <ListModal tokenId={item.tokenId}>
            <button className="w-full rounded-lg bg-sky-600 py-2 text-lg font-semibold text-gray-100">
              List Now
            </button>
          </ListModal>
        </div>
      )}
    </div>
  );
};
