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
import { ReactNode, useState } from "react";

import { useWallet } from "@/context/walletProvider";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2 } from "lucide-react";

type EditDescriptionModalProps = {
  tokenId: number;
  description: string;
  children: ReactNode;
};

const apiURL = import.meta.env.VITE_API_URL;

export const EditDescriptionModal: React.FC<EditDescriptionModalProps> = ({
  children,
  description,
  tokenId,
}) => {
  const { accountAddr } = useWallet();
  const [text, setText] = useState(description);
  const { toast } = useToast();

  const params = {
    userAddr: accountAddr,
    description: text,
  };

  const updateDB = async () => {
    await fetch(`${apiURL}/nfts/${tokenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    toast({
      title: (
        <div className="flex items-center justify-start gap-1">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Edit Description Successfully!
        </div>
      ),
    });
  };
  console.log(111);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className=" overflow-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit NFT description</AlertDialogTitle>
          <textarea
            id="description"
            placeholder="Enter a description"
            value={text}
            className="text-md h-fit min-h-32 w-full appearance-none rounded-lg border p-3 text-zinc-500 placeholder:text-zinc-500 focus:outline-none "
            onChange={(e) => setText(e.target.value)}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={updateDB}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
