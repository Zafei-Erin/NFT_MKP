import { useWallet } from "@/context/walletProvider";
import { XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

/* 
  Display "Connect Wallet" when not connected, 
  else display user account address
*/

export const ConnectWalletBtn = () => {
  const { accountAddr, setAccountAddr, connect } = useWallet();
  const { toast } = useToast();

  const updateAccount = (account: string[]) => {
    setAccountAddr(account[0]);
  };
  const disconnectAccount = () => {
    setAccountAddr("");
    window.location.reload();
  };

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", updateAccount);
    window.ethereum.on("disconnect", disconnectAccount);
  }

  const connectWallet = async () => {
    if (accountAddr) {
      return;
    }
    const res = await connect();
    if (!res.success) {
      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <XCircle className="h-5 w-5 text-red-600" />
            Failed to connect wallet
          </div>
        ),
        description: res.message,
      });
    }
  };

  return (
    <Button onClick={connectWallet}>
      {accountAddr == "" || accountAddr == undefined
        ? "Connect Wallet"
        : accountAddr?.slice(0, 4) + "..." + accountAddr?.slice(38)}
    </Button>
  );
};
