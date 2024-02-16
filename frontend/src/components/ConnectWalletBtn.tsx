import { useEffect } from "react";
import { useWallet } from "../context/walletProvider";
import { buttonVariants } from "@/components/ui/button";

export const ConnectWalletBtn = () => {
  const { accountAddr, setAccountAddr, provider, connect } = useWallet();

  const updateAccount = (account: string[]) => {
    setAccountAddr(account[0]);
  };
  const disconnectAccount = () => {
    setAccountAddr("");
    window.location.reload();
  };
  useEffect(() => {
    if (provider) {
      provider.on("accountsChanged", updateAccount);
      provider.on("disconnect", disconnectAccount);

      return () => {
        provider.removeListener("accountsChanged", updateAccount);
        provider.removeListener("disconnect", disconnectAccount);
      };
    }
  }, [provider]);

  return (
    <button
      onClick={() => {
        if (!accountAddr) {
          connect();
        }
      }}
      className={buttonVariants()}
    >
      {accountAddr == "" || accountAddr == undefined
        ? "Connect Wallet"
        : accountAddr?.slice(0, 4) + "..." + accountAddr?.slice(38)}
    </button>
  );
};
