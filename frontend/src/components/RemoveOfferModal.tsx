import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useWallet } from "@/context/walletProvider";
import { Offer } from "@/types/types";
import { CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";
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
    if (!accountAddr) {
      console.log("continue: ", accountAddr);
      return;
    }

    const response = await fetch(`${apiURL}/offer/${offer.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    await response.json();
  };

  const action = () => {
    removeOffer();
    toast({
      title: (
        <div className="flex items-center justify-start gap-1">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Edit Offer Success!
        </div>
      ),
      description: "Your NFT is created!",
    });
    window.location.reload();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
