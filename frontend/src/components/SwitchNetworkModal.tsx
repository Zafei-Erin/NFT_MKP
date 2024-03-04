import { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useNetwork } from "@/context/networkProvider/networkProvider";

type Props = {
  children?: ReactNode | undefined;
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void | undefined;
};

export const SwitchNetworkModal: React.FC<Props> = ({
  children,
  open,
  onOpenChange,
}) => {
  const { switchNetwork } = useNetwork();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="bg-black/10" />
      <AlertDialogContent className="rounded-lg max-sm:w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Switch network</AlertDialogTitle>
          <AlertDialogDescription>
            Please switch to Mumbai network and try again.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={switchNetwork}>Swtich</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
