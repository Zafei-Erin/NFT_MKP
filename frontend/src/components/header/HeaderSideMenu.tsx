import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { ConnectWalletBtn } from "../connectWallet/ConnectWalletBtn";
import { Button, buttonVariants } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "../ui/sheet";
import { WelcomeModal } from "./WelcomeModal";

export const HeaderSideMenu: React.FC<PropsWithChildren> = (props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent>
        <div className="mb-16 grid gap-4 py-4">
          <SheetClose asChild>
            <Link to="/">
              <p className="rounded-lg border border-transparent px-3 py-2 text-gray-900 transition-all duration-150 hover:border-slate-900">
                Home
              </p>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/create">
              <p className="rounded-lg border border-transparent px-3 py-2 text-gray-900 transition-all duration-150 hover:border-slate-900">
                Create
              </p>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/myAssets">
              <p className="rounded-lg border border-transparent px-3 py-2 text-gray-900 transition-all duration-150 hover:border-slate-900">
                My Digital Assets
              </p>
            </Link>
          </SheetClose> 
          <SheetClose asChild>
            <WelcomeModal>
              <button className="rounded-lg border border-transparent px-3 py-2 text-left text-gray-900 transition-all duration-150 hover:border-slate-900">
                Instruction
              </button>
            </WelcomeModal>
          </SheetClose>
        </div>
        <SheetFooter className="flex flex-col gap-2">
          <SheetClose asChild>
            <ConnectWalletBtn />
          </SheetClose>

          <SheetClose asChild>
            <Button
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-gray-900",
              )}
            >
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
