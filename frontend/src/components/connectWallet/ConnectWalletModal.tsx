import { ReactNode, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";
import { useNetwork } from "@/context/networkProvider/networkProvider";
import { useSwitchAndConnect } from "./useSwitchAndConnect";

type ConnectWalletModalProps = {
  open?: boolean | undefined;
  title?: ReactNode | undefined;
  children?: ReactNode | undefined;
  description?: ReactNode | undefined;
  onOpenChange?: (open: boolean) => void | undefined;
};

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  children,
  title,
  description,
  open,
  onOpenChange,
}) => {
  const { getNetwork } = useNetwork();
  const { switchAndConnect } = useSwitchAndConnect();
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
          <AlertDialogTitle>
            {title ? title : isTestnet ? "Connect Wallet" : "Switch Network"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description
              ? description
              : isTestnet
                ? "Please connect wallet and try again."
                : "Please switch network and try again."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={switchAndConnect}>
            {isTestnet ? "Connect" : "Switch"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
