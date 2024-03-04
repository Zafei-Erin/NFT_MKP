import { Link } from "react-router-dom";
import { HeaderSideMenu } from "./HeaderSideMenu";
import { LightLogo } from "../assets";
import { Button } from "./ui/button";
import HeaderToggleIcon from "@/assets/HeaderToggleIcon";
import { ConnectWalletBtn } from "./connectWallet/ConnectWalletBtn";
import { ConnectWalletModal } from "./connectWallet/ConnectWalletModal";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const Description = () => (
    <div className="space-y-3">
      <p>
        This app is deployed on Polygon Mumbai test net. To have a full
        experience, please
      </p>
      <ul>
        <li>1. install Metamask extenstion in your browser</li>
        <li>2. switch to Mumbai test net</li>
        <li>3. connect your wallet</li>
      </ul>
      <p>
        To creact or purchase NFTs, you will need some Matic tokens. Go get some
        <a
          href="https://faucet.polygon.technology/"
          className="ml-1 font-semibold underline hover:text-sky-700"
          target="_blank"
        >
          here
        </a>
        . It is free.
      </p>

      <p>
        If you want to watch this instruction again, you can find it in header.
      </p>
    </div>
  );

  useEffect(() => {
    const shown = sessionStorage.getItem("shown");
    console.log(shown);

    if (shown !== "true") {
      setIsModalOpen(true);
      sessionStorage.setItem("shown", "true");
    }
  }, []);
  return (
    <div className="h-[6rem] bg-gradient-to-b from-gray-100/20 p-7 text-gray-900">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-6">
        <Link to="/" className="flex items-center space-x-3">
          <LightLogo className="h-8 w-8 rounded-full bg-sky-500 p-1 text-white" />
          <p className="text-xl font-bold">NFT Marketplace</p>
        </Link>

        <div className="hidden h-full w-px bg-gray-600/30 md:block" />

        <div className="flex w-auto flex-grow font-semibold max-md:hidden">
          <Link to="/">
            <p className="py-2 pr-2 hover:text-gray-900/60">Home</p>
          </Link>
          <Link to="/create">
            <p className="px-3 py-2 hover:text-gray-900/60">Create</p>
          </Link>
          <Link to="/myAssets">
            <p className="px-3 py-2 hover:text-gray-900/60">My Assets</p>
          </Link>
          <ConnectWalletModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            title={"Welcome!"}
            description={<Description />}
          >
            <button className="px-3 py-2 hover:text-gray-900/60">
              Instruction
            </button>
          </ConnectWalletModal>
          {/* <Link to="/test">
            <p className="px-3 py-2 hover:text-gray-900/60">test</p>
          </Link> */}
        </div>
        <div className="max-md:hidden">
          <ConnectWalletBtn />
        </div>

        <HeaderSideMenu>
          <Button variant="outline" className="md:hidden">
            <HeaderToggleIcon />
          </Button>
        </HeaderSideMenu>
      </div>
    </div>
  );
};
