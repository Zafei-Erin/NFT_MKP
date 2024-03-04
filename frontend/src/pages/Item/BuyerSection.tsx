import { Spinner } from "@/assets";
import { ConnectWalletModal } from "@/components/connectWallet/ConnectWalletModal";
import { useNetwork } from "@/context/networkProvider/networkProvider";
import { useWallet } from "@/context/walletProvider";
import { NFT } from "@/types/types";
import { ShoppingCart, Tag } from "lucide-react";
import { useState } from "react";
import { BuyModal } from "./BuyModal";
import { OfferModal } from "./OfferModal";

type BuyerSectionProps = {
  item: NFT;
};

export const BuyerSection: React.FC<BuyerSectionProps> = ({ item }) => {
  const { accountAddr } = useWallet();
  const { getNetwork } = useNetwork();
  const [buying, setBuying] = useState(false);
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState<boolean>(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);

  const openConnectWalletModal = async () => {
    const res = await getNetwork();

    if (!accountAddr || !res.success) {
      setIsConnectWalletModalOpen(true);
      return;
    }
  };

  if (!item.listed) {
    return (
      <div>
        <div className="flex w-full flex-col items-start justify-start gap-3 rounded-lg border p-6">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-xl font-semibold text-gray-600 sm:text-3xl">
            This item is not listing
          </div>
          <div className="flex h-full w-full flex-col  gap-3 md:flex-row">
            <OfferModal tokenId={item.tokenId}>
              <button
                onClick={openConnectWalletModal}
                className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-sky-600 py-2 text-lg font-semibold text-sky-600 hover:bg-gray-100 hover:text-sky-700"
              >
                <Tag className="h-5 w-5" />
                Place Offer
              </button>
            </OfferModal>

            <ConnectWalletModal
              open={isConnectWalletModalOpen}
              onOpenChange={setIsConnectWalletModalOpen}
            />
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
        <div className="flex h-full w-full flex-col gap-3 md:flex-row">
          <BuyModal
            item={item}
            setBuying={setBuying}
            open={isBuyModalOpen}
            onOpenChange={setIsBuyModalOpen}
          >
            <button
              disabled={buying}
              onClick={openConnectWalletModal}
              className="flex w-full items-center justify-center gap-1 rounded-xl bg-sky-600 py-2 text-lg font-semibold text-gray-100 hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-700"
            >
              {buying ? (
                <Spinner className="h-5 w-5" />
              ) : (
                <ShoppingCart className="h-5 w-5" />
              )}
              Buy
            </button>
          </BuyModal>

          <OfferModal tokenId={item.tokenId}>
            <button
              onClick={openConnectWalletModal}
              className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-sky-600 py-2 text-lg font-semibold text-sky-600 hover:bg-gray-100 hover:text-sky-700"
            >
              <Tag className="h-5 w-5" />
              Place Offer
            </button>
          </OfferModal>
          <ConnectWalletModal
            open={isConnectWalletModalOpen}
            onOpenChange={setIsConnectWalletModalOpen}
          />
        </div>
      </div>
    </div>
  );
};
