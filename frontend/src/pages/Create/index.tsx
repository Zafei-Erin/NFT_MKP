import { Label } from "@radix-ui/react-label";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Spinner, UploadIcon } from "@/assets";
import { ConnectWalletModal } from "@/components/connectWallet/ConnectWalletModal";
import { useNetwork } from "@/context/networkProvider/networkProvider";
import { useWallet } from "@/context/walletProvider";
import { CreateModal } from "./CreateModal";
import { MissingInputModal } from "./MissingInputModal";

export type formInputType = {
  img: File | null;
  name: string;
  description: string;
};

export const Create = () => {
  const { accountAddr } = useWallet();
  const { getNetwork } = useNetwork();
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isMissingInputModalOpen, setIsMissingInputModalOpen] =
    useState<boolean>(false);
  const [formInput, updateFormInput] = useState<formInputType>({
    img: null,
    name: "",
    description: "",
  });

  const openConnectWalletModal = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // if input is incomplete
    const { name, img } = formInput;
    if (!name || !img) {
      e.preventDefault();
      setIsMissingInputModalOpen(true);
      return;
    }

    const res = await getNetwork();
    // if is in test net and is connected
    if (accountAddr && res.success) {
      e.preventDefault();
      setIsCreateModalOpen(true);
      return;
    }

    // if all set
    setIsConnectWalletModalOpen(true);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="grid w-full max-w-screen-xl grid-cols-1 justify-items-center gap-10 p-8 md:grid-cols-2 ">
        {/* first part */}
        <div className="flex w-full flex-col items-start justify-start space-y-10">
          {/* header */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Create an NFT</h3>
            <p>
              Once your item is minted you will not be able to change its image
              and name.
            </p>
          </div>
          {/* upload img input */}
          <div className="flex w-full items-center justify-center">
            <div className="relative aspect-square w-80 md:w-full">
              <label className="h-full w-full">
                {imgPreviewUrl === "" ? (
                  <div className="flex h-full w-full cursor-pointer appearance-none justify-center rounded-xl border border-dashed border-gray-400 bg-white px-14 transition hover:border-solid hover:border-gray-400 hover:bg-gray-200/30 focus:outline-none">
                    <span className="flex flex-col items-center justify-center space-x-2 text-sm">
                      <UploadIcon className="mb-6 h-6 w-6 text-gray-900" />
                      <span className="font-semibold text-gray-600">
                        Drag and drop media
                      </span>
                      <span className="font-semibold text-sky-600">
                        Browse files
                      </span>
                      <span className="text-gray-700">Max size: 50MB</span>
                      <span className="text-gray-700">
                        JPG, PNG, GIF, SVG, MP4
                      </span>
                    </span>
                  </div>
                ) : (
                  <div
                    className="group flex"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img
                      src={imgPreviewUrl}
                      alt="imgPreview"
                      className="gropu-hover:shadow-2xl absolute h-full w-full rounded-xl object-cover transition duration-150 ease-in-out group-hover:-translate-y-1"
                    />
                    <div className="absolute z-50 h-full w-full rounded-xl transition duration-150 ease-in-out group-hover:-translate-y-1 group-hover:bg-gray-900/60" />
                    <button
                      className="hover:cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setImgPreviewUrl("");
                        updateFormInput({ ...formInput, img: null });
                      }}
                    >
                      <Trash2 className="absolute right-6 top-6 z-50 hidden h-6 w-6 stroke-white hover:stroke-red-600 group-hover:block" />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImgPreviewUrl(URL.createObjectURL(e.target.files[0]));
                      updateFormInput({ ...formInput, img: e.target.files[0] });
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* second part */}
        <div className="flex w-full flex-col justify-center gap-8">
          <div className="flex w-full flex-col items-start justify-start gap-3">
            <Label htmlFor="itemName" className="text-md font-semibold">
              Name *
            </Label>
            <input
              id="itemName"
              required
              placeholder="Name your NFT"
              className="text-md h-fit w-full appearance-none rounded-lg border p-3 text-zinc-500 placeholder:text-zinc-500 focus:outline-none "
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-3">
            <Label htmlFor="description" className="text-md font-semibold">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Enter a description"
              className="text-md h-fit min-h-32 w-full appearance-none rounded-lg border p-3 text-zinc-500 placeholder:text-zinc-500 focus:outline-none "
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
            />
          </div>
          <button
            onClick={openConnectWalletModal}
            disabled={isCreating}
            className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 p-4 font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {isCreating && <Spinner className="h-6 w-6" />}
            Create Digital Asset
          </button>
          <MissingInputModal
            open={isMissingInputModalOpen}
            onOpenChange={setIsMissingInputModalOpen}
          />

          <CreateModal
            setIsCreating={setIsCreating}
            formInput={formInput}
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
          />

          <ConnectWalletModal
            open={isConnectWalletModalOpen}
            onOpenChange={setIsConnectWalletModalOpen}
          />
        </div>
      </div>
    </div>
  );
};
