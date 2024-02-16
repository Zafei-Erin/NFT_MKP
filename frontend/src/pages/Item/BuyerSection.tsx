import { NFT } from "@/types/types";
import { BuyModal } from "./BuyModal";
import { OfferModal } from "./OfferModal";
import { useWallet } from "@/context/walletProvider";
import { ConnectWalletModal } from "@/components/ConnectWalletModal";
import { ShoppingCart, Tag } from "lucide-react";

type BuyerSectionProps = {
  item: NFT;
};

export const BuyerSection: React.FC<BuyerSectionProps> = ({ item }) => {
  const { accountAddr } = useWallet();

  if (!item.listed) {
    return (
      <div>
        <div className="flex w-full flex-col items-start justify-start gap-3 rounded-lg border p-6">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-xl font-semibold text-gray-600 sm:text-3xl">
            This item is not listing
          </div>
          <div className="flex h-full w-full flex-col  gap-3 md:flex-row">
            {accountAddr === "" ? (
              <ConnectWalletModal>
                <button className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-sky-600 py-2 text-lg font-semibold text-sky-600 hover:bg-gray-100 hover:text-sky-700">
                  <Tag className="h-5 w-5" />
                  Place Offer
                </button>
              </ConnectWalletModal>
            ) : (
              <OfferModal tokenId={item.tokenId}>
                <button className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-sky-600 py-2 text-lg font-semibold text-sky-600 hover:bg-gray-100 hover:text-sky-700">
                  <Tag className="h-5 w-5" />
                  Place Offer
                </button>
              </OfferModal>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full flex-col items-start justify-start gap-3 rounded-lg border p-6">
        <div className="text-sm text-gray-600">Price</div>
        <div className="text-xl font-semibold sm:text-3xl">
          {item.price} ETH
        </div>
        <div className="flex h-full w-full flex-col  gap-3 md:flex-row">
          {accountAddr === "" ? (
            <ConnectWalletModal>
              <button className="flex w-full items-center justify-center gap-1 rounded-xl bg-sky-600 py-2 text-lg font-semibold text-gray-100 hover:bg-sky-700">
                <ShoppingCart className="h-5 w-5" />
                Buy
              </button>
            </ConnectWalletModal>
          ) : (
            <BuyModal item={item}>
              <button className="flex w-full items-center justify-center gap-1 rounded-xl bg-sky-600 py-2 text-lg font-semibold text-gray-100 hover:bg-sky-700">
                <ShoppingCart className="h-5 w-5" />
                Buy
              </button>
            </BuyModal>
          )}
          {accountAddr === "" ? (
            <ConnectWalletModal>
              <button className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-sky-600 py-2 text-lg font-semibold text-sky-600 hover:bg-gray-100 hover:text-sky-700">
                <Tag className="h-5 w-5" />
                Place Offer
              </button>
            </ConnectWalletModal>
          ) : (
            <OfferModal tokenId={item.tokenId}>
              <button className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-sky-600 py-2 text-lg font-semibold text-sky-600 hover:bg-gray-100 hover:text-sky-700">
                <Tag className="h-5 w-5" />
                Place Offer
              </button>
            </OfferModal>
          )}
        </div>
      </div>
    </div>
  );
};
