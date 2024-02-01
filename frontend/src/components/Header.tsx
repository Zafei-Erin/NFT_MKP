import { Link } from "react-router-dom";
import { HeaderSideMenu } from "./HeaderSideMenu";
import { LightLogo } from "../assets";
import { Button } from "./ui/button";
import HeaderToggleIcon from "@/assets/HeaderToggleIcon";
import { ConnectWallet } from "./ConnectWallet";

export const Header = () => {
  return (
    <div className="bg-transparent mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-6 p-7 sticky z-50">
      <Link to="/" className="flex items-center space-x-3">
        <LightLogo className="h-8 w-8 rounded-full bg-sky-500 p-1 text-white" />
        <p className="text-xl font-bold">NFT Marketplace</p>
      </Link>

      <div className="">
        <HeaderSideMenu>
          <Button variant="outline" className="md:hidden">
            <HeaderToggleIcon />
          </Button>
        </HeaderSideMenu>
      </div>

      <div className="max-md:hidden flex w-auto flex-grow font-semibold divide-x-2 divide-gray-400/20">
        <Link to="/">
          <p className="px-3 py-2 text-gray-900 hover:text-gray-600">Home</p>
        </Link>
        <Link to="/create">
          <p className="px-3 py-2 text-gray-900 hover:text-gray-600">Create</p>
        </Link>
        <Link to="/myAssets">
          <p className="px-3 py-2 text-gray-900 hover:text-gray-600">
            My Assets
          </p>
        </Link>
        <Link to="/test">
          <p className="px-3 py-2 text-gray-900 hover:text-gray-600">test</p>
        </Link>
      </div>
      <div className="max-md:hidden">
        <ConnectWallet />
      </div>
    </div>
  );
};
