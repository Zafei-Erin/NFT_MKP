import { ListModal } from "@/components/ListModal";
import { UpdateListingModal } from "@/components/UpdateListingModal";
import { ConnectWalletModal } from "@/components/connectWallet/ConnectWalletModal";
import { useNetwork } from "@/context/networkProvider/networkProvider";
import { useWallet } from "@/context/walletProvider";
import { NFT } from "@/types/types";
import { useState } from "react";

type OwnerSectionProps = {
  item: NFT;
};

export const OwnerSection: React.FC<OwnerSectionProps> = ({ item }) => {
  const { accountAddr } = useWallet();
  const { getNetwork } = useNetwork();
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false);

  const openConnectWalletModal = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const res = await getNetwork();
    if (accountAddr && res.success) {
      return;
    }

    e.stopPropagation();
    setIsConnectWalletModalOpen(true);
  };

  return (
    <div>
      {item.listed ? (
        <div className="flex w-full flex-col items-start justify-start gap-3 rounded-lg border p-6">
          <div className="text-sm text-gray-600">Price</div>
          <div className="text-xl font-semibold sm:text-3xl">
            {item.price} MATIC
          </div>
          <UpdateListingModal tokenId={item.tokenId}>
            <button
              onClick={openConnectWalletModal}
              className="w-full rounded-lg bg-sky-600 py-2 text-lg font-semibold text-gray-100"
            >
              Edit Listing
            </button>
          </UpdateListingModal>
        </div>
      ) : (
        <div className="flex w-full flex-col items-start justify-start gap-3 rounded-lg border p-6">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-xl font-semibold text-gray-600 sm:text-3xl">
            This item is not listing
          </div>
          <ListModal tokenId={item.tokenId}>
            <button
              onClick={openConnectWalletModal}
              className="w-full rounded-lg bg-sky-600 py-2 text-lg font-semibold text-gray-100"
            >
              List Now
            </button>
          </ListModal>
        </div>
      )}
      <ConnectWalletModal
        open={isConnectWalletModalOpen}
        onOpenChange={setIsConnectWalletModalOpen}
      />
    </div>
  );
};
