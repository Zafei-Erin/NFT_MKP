import { ethers } from "ethers";
import { ReactNode, createContext, useContext, useState } from "react";

type WalletContextType = {
  accountAddr: string;
  setAccountAddr: (prop: string) => void;
  provider: ethers.providers.Web3Provider | undefined;
  setProvider: (prop: ethers.providers.Web3Provider) => void;
  connect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | null>(null);

const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountAddr, setAccountAddr] = useState("");
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      const metaMaskProvider = window.ethereum.providers.find(
        (p) => p.isMetaMask
      );
      try {
        const account = await metaMaskProvider.request({
          method: "eth_requestAccounts",
        });
        setAccountAddr(account[0]);
      } catch (error) {
        console.log("err: ", error);
      } finally {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
      }
    } else {
      alert("Please install MetaMask first!");
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

const useWallet = () => {
  const userAccContext = useContext(WalletContext);

  if (!userAccContext) {
    throw new Error(
      "UserAccContext has to be used within <UserAccContext.Provider>"
    );
  }

  return userAccContext;
};

export { WalletProvider, useWallet };
