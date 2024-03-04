import { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";

type Props = {
  children?: ReactNode | undefined;
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void | undefined;
};

export const MissingInputModal: React.FC<Props> = ({
  open,
  onOpenChange,
  children,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <button onClick={() => {}}>{children}</button>
      </AlertDialogTrigger>
      <AlertDialogOverlay className="bg-black/10" />
      <AlertDialogContent className="overflow-auto rounded-lg max-sm:w-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle>{"Oops"}</AlertDialogTitle>
          <p>
            Some data are missing. Please provide image and name for your NFT.
          </p>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
