import { useNetwork } from "@/context/networkProvider/networkProvider";
import { useToast } from "../ui/use-toast";
import { XCircle } from "lucide-react";
import { useEffect } from "react";
import { useWallet } from "@/context/walletProvider";

export const useSwitchAndConnect = () => {
  const { getNetwork, switchNetwork } = useNetwork();
  const { toast } = useToast();
  const { connect } = useWallet();

  useEffect(() => {
    const reloading = sessionStorage.getItem("switched");

    if (reloading) {
      sessionStorage.removeItem("switched");
      connectWallet();
    }
  });

  const connectWallet = async () => {
    const walletRes = await connect();
    if (!walletRes.success) {
      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <XCircle className="h-5 w-5 text-red-600" />
            Failed to connect wallet
          </div>
        ),
        description: walletRes.message,
      });
    }
  };

  const switchAndConnect = async () => {
    const networkResp = await getNetwork();
    if (
      !networkResp.success &&
      networkResp.message === "Please install MetaMask first!"
    ) {
      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <XCircle className="h-5 w-5 text-red-600" />
            Failed to connect wallet
          </div>
        ),
        description: networkResp.message,
      });
      return;
    }

    if (!networkResp.success) {
      const switchResp = await switchNetwork();
      if (switchResp.success) {
        // enable auto connect wallet after reloading
        sessionStorage.setItem("switched", "true");
        window.location.reload();
        return;
      } else {
        toast({
          title: (
            <div className="flex items-center justify-start gap-1">
              <XCircle className="h-5 w-5 text-red-600" />
              Failed to switch network
            </div>
          ),
          description: switchResp.message,
        });
        return;
      }
    }

    connectWallet();
  };

  return { switchAndConnect };
};
