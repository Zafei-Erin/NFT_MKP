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
} from "@/components/ui/alert-dialog";
import { useWallet } from "@/context/walletProvider";
import { ReactNode } from "react";

type ConnectWalletModalProps = {
  children: ReactNode;
};

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  children,
}) => {
  const { connect } = useWallet();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg max-sm:w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Connect Wallet</AlertDialogTitle>
          <AlertDialogDescription>
            Please connect wallet and try again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={connect}>
            <div>Connect Wallet</div>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
