import { getErrorMessage } from "@/lib/utils";
import { ethers, providers } from "ethers";
import { ReactNode, createContext, useState } from "react";

type WalletContextType = {
  accountAddr: string;
  setAccountAddr: (prop: string) => void;
  provider: ethers.providers.Web3Provider | undefined;
  setProvider: (prop: ethers.providers.Web3Provider) => void;
  connect: () => Promise<Status>;
};

type Status = {
  success: boolean;
  message?: string | undefined;
};

export const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountAddr, setAccountAddr] = useState("");
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();

  const connect = async (): Promise<Status> => {
    if (typeof window.ethereum !== "undefined") {
      const metaMaskProvider = window.ethereum.providers.find(
        (p: providers.ExternalProvider) => p.isMetaMask,
      );
      try {
        const account = await metaMaskProvider.request({
          method: "eth_requestAccounts",
        });
        setAccountAddr(account[0]);
        return { success: true };
      } catch (err) {
        const message = getErrorMessage(err);
        return { success: false, message };
      } finally {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    } else {
      return { success: false, message: "Please install MetaMask first!" };
    }
  };

  return (
    <WalletContext.Provider
      value={{ accountAddr, setAccountAddr, provider, setProvider, connect }}
    >
      {children}
    </WalletContext.Provider>
  );
};


