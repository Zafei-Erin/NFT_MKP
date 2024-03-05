import { ReactNode, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSwitchAndConnect } from "../connectWallet/useSwitchAndConnect";
import { useNetwork } from "@/context/networkProvider/networkProvider";

type Props = {
  open?: boolean | undefined;
  children?: ReactNode | undefined;
  onOpenChange?: (open: boolean) => void | undefined;
};

export const WelcomeModal: React.FC<Props> = ({
  children,
  open,
  onOpenChange,
}) => {
  const { switchAndConnect } = useSwitchAndConnect();
  const { getNetwork } = useNetwork();
  const [isTestnet, setIsTestnet] = useState<boolean>();

  useEffect(() => {
    const init = async () => {
      const resp = await getNetwork();
      setIsTestnet(resp.success);
    };

    init();
  });
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="bg-black/10" />
      <AlertDialogContent className="rounded-lg max-sm:w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome!</AlertDialogTitle>
          <Description />
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={switchAndConnect}>
            {isTestnet ? "Connect" : "Switch"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Description = () => (
  <div className="space-y-6 text-left text-sm text-muted-foreground">
    <div className="space-y-3">
      <p>
        This app is deployed on Polygon Mumbai test net. To have a full
        experience, you will need:
      </p>
      <ul className="ml-4 space-y-3">
        <li>
          1.{" "}
          <a
            className="font-semibold underline hover:text-sky-700"
            target="_blank"
            href="https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=zh-CN&utm_source=ext_sidebar"
          >
            Metamask extenstion
          </a>{" "}
          installed in your browser.{" "}
        </li>
        <li>
          2. A wallet connected through Metamask. If you don't have one, follow
          the instruction in Metamask extenstion to create one.
        </li>
        <li>
          3. Switching network to Mumbai test net (we will help you with that).
        </li>
      </ul>
    </div>
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
