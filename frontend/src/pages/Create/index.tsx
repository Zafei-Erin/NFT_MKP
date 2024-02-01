import { useState } from "react";

import { UploadIcon } from "@/assets";
import { Label } from "@radix-ui/react-label";
import { ProgressModal } from "./ProgressModal";

export type formInputType = {
  img: File | null;
  name: string;
  description: string;
};

export const Create = () => {
  const [imgPreviewUrl, setImgPreviewUrl] = useState("");
  const [formInput, updateFormInput] = useState<formInputType>({
    img: null,
    name: "",
    description: "",
  });

  return (
    <div className="flex items-center justify-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center p-8 max-w-screen-xl ">
        {/* first part */}
        <div className="space-y-10 flex flex-col items-start justify-start w-full">
          {/* header */}
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">Create an NFT</h3>
            <p>
              Once your item is minted you will not be able to change its image
              and name.
            </p>
          </div>
          {/* upload img input */}
          <div className="w-full flex items-center justify-center">
            <div className="w-80 md:w-full relative aspect-square">
              <label className="w-full h-full">
                {imgPreviewUrl === "" ? (
                  <div className="flex justify-center w-full h-full px-14 transition bg-white border border-gray-400 border-dashed rounded-xl appearance-none cursor-pointer hover:border-gray-400 hover:border-solid hover:bg-gray-200/30 focus:outline-none">
                    <span className="flex flex-col items-center justify-center space-x-2 text-sm">
                      <UploadIcon className="w-6 h-6 mb-6 text-gray-900" />
                      <span className="font-semibold text-gray-600">
                        Drag and drop media
                      </span>
                      <span className="text-sky-600 font-semibold">
                        Browse files
                      </span>
                      <span className="text-gray-700">Max size: 50MB</span>
                      <span className="text-gray-700">
                        JPG, PNG, GIF, SVG, MP4
                      </span>
                    </span>
                  </div>
                ) : (
                  <img
                    src={imgPreviewUrl}
                    alt="imgPreview"
                    className="absolute w-full h-full object-cover rounded-xl hover:shadow-2xl transition ease-in-out hover:-translate-y-1 duration-150"
                  />
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
        <div className="flex flex-col justify-center w-full gap-8">
          <div className="flex flex-col items-start justify-start gap-3 w-full">
            <Label htmlFor="itemName" className="text-md font-semibold">
              Name *
            </Label>
            <input
              id="itemName"
              required
              placeholder="Name your NFT"
              className="rounded-lg border p-3 w-full text-md text-zinc-500 placeholder:text-zinc-500 h-fit appearance-none focus:outline-none "
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col items-start justify-center gap-3 w-full">
            <Label htmlFor="description" className="text-md font-semibold">
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Enter a description"
              className="rounded-lg border p-3 w-full min-h-32 text-md text-zinc-500 placeholder:text-zinc-500 h-fit appearance-none focus:outline-none "
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
            />
          </div>
          {/* <button
            onClick={mintNFT}
            className="mt-4 rounded-lg bg-sky-500 p-4 font-bold text-white shadow-lg"
          >
            Create Digital Asset
          </button> */}
          <ProgressModal formInput={formInput} />
        </div>
      </div>
    </div>
  );
};
