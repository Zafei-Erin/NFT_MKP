import { Link } from "react-router-dom";
import { HeaderSideMenu } from "./HeaderSideMenu";
import { LightLogo } from "../assets";
import { Button } from "./ui/button";
import HeaderToggleIcon from "@/assets/HeaderToggleIcon";
import { ConnectWallet } from "./ConnectWallet";

export const Header = () => {
  return (
    <div className="sticky z-50 mx-auto flex h-[6rem] max-w-screen-2xl flex-wrap items-center justify-between gap-6 bg-gradient-to-b from-gray-100/20 p-7 text-gray-900">
      <Link to="/" className="flex items-center space-x-3">
        <LightLogo className="h-8 w-8 rounded-full bg-sky-500 p-1 text-white" />
        <p className="text-xl font-bold">NFT Marketplace</p>
      </Link>

      <div className="hidden h-full w-px bg-gray-600/30 md:block"></div>

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
        <Link to="/test">
          <p className="px-3 py-2 hover:text-gray-900/60">test</p>
        </Link>
      </div>
      <div className="max-md:hidden">
        <ConnectWallet />
      </div>

      <HeaderSideMenu>
        <Button variant="outline" className="md:hidden">
          <HeaderToggleIcon />
        </Button>
      </HeaderSideMenu>
    </div>
  );
};
