import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "./ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "./ui/sheet";
import { ConnectWallet } from "./ConnectWallet";
import { cn } from "@/lib/utils";

export const HeaderSideMenu: React.FC<PropsWithChildren> = (props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{props.children}</SheetTrigger>
      <SheetContent>
        <div className="grid gap-4 py-4">
          <SheetClose asChild>
            <Link to="/">
              <p className="px-3 py-2 text-gray-900 border border-transparent transition-all duration-150 hover:border-slate-900 rounded-lg">
                Home
              </p>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/create">
              <p className="px-3 py-2 text-gray-900 border border-transparent transition-all duration-150 hover:border-slate-900 rounded-lg">
                Create
              </p>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/myAssets">
              <p className="px-3 py-2 text-gray-900 border border-transparent transition-all duration-150 hover:border-slate-900 rounded-lg">
                My Digital Assets
              </p>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/creatorDashboard">
              <p className="px-3 py-2 text-gray-900 border border-transparent transition-all duration-150 hover:border-slate-900 rounded-lg">
                Creator Dashboard
              </p>
            </Link>
          </SheetClose>
        </div>
        <SheetFooter className="flex flex-col gap-2">
          <SheetClose asChild>
            <ConnectWallet />
          </SheetClose>

          <SheetClose asChild>
            <Button
              className={cn(
                buttonVariants({ variant: "outline" }),
                "text-gray-900"
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
