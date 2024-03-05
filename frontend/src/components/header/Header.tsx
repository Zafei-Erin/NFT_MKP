import HeaderToggleIcon from "@/assets/HeaderToggleIcon";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LightLogo } from "../../assets";
import { ConnectWalletBtn } from "../connectWallet/ConnectWalletBtn";
import { Button } from "../ui/button";
import { HeaderSideMenu } from "./HeaderSideMenu";
import { WelcomeModal } from "./WelcomeModal";

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // only display welcome modal when user enter for the first time
  useEffect(() => {
    const shown = sessionStorage.getItem("shown");

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
            <p className="py-2 pr-2 transition-all hover:text-gray-900/60">
              Home
            </p>
          </Link>
          <Link to="/create">
            <p className="px-3 py-2 transition-all hover:text-gray-900/60">
              Create
            </p>
          </Link>
          <Link to="/myAssets">
            <p className="px-3 py-2 transition-all hover:text-gray-900/60">
              My Assets
            </p>
          </Link>
          <WelcomeModal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <button className="px-3 py-2 transition-all hover:text-gray-900/60">
              Instruction
            </button>
          </WelcomeModal>
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
