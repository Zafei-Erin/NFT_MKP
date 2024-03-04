import { CheckCircle2, XCircle } from "lucide-react";
import { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useWallet } from "@/context/walletProvider";
import { Offer } from "@/types/types";
import { useToast } from "./ui/use-toast";

type EditOfferModalProps = {
  offer: Offer;
  children: ReactNode;
};

const apiURL = import.meta.env.VITE_API_URL;

export const RemoveOfferModal: React.FC<EditOfferModalProps> = ({
  children,
  offer,
}) => {
  const { accountAddr } = useWallet();
  const { toast } = useToast();

  const removeOffer = async () => {
    const response = await fetch(`${apiURL}/offers/${offer.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    await response.json();
  };

  const action = async () => {
    if (!accountAddr) {
      return;
    }
    try {
      await removeOffer();
      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Remove Offer Successfully!
          </div>
        ),
        description: "This offer is removed!",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <XCircle className="h-5 w-5 text-red-600" />
            Failed to remove offer
          </div>
        ),
        description: "Something went wrong.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="bg-black/10" />
      <AlertDialogContent className=" overflow-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel offer</AlertDialogTitle>
          <div className="">Do you confirm to remove this offer?</div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              action();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
