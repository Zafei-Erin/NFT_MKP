import { testnet } from "@/constant";
import { providers } from "ethers";
import { ReactNode, createContext, useContext, useEffect } from "react";
import { useWallet } from "../walletProvider";

type networkContextType = {
  switchNetwork: () => Promise<Status>;
  getNetwork: () => Promise<Status>;
};

type Status = {
  success: boolean;
  message?: string | undefined;
};

const NetworkContext = createContext<networkContextType | null>(null);

const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const { connect } = useWallet();

  // auto-connect to wallet when switch network
  const autoConnect = () => {
    sessionStorage.setItem("switched", "true");
    window.location.reload();
  };
  if (window.ethereum) {
    window.ethereum.on("chainChanged", autoConnect);
  }
  useEffect(() => {
    const reloading = sessionStorage.getItem("switched");
    if (reloading) {
      sessionStorage.removeItem("switched");
      connect();
    }
  });

  const getNetwork = async (): Promise<Status> => {
    if (
      window.ethereum === undefined ||
      window.ethereum.providers === undefined
    ) {
      return { success: false, message: "Please install MetaMask first!" };
    }
    const metaMaskProvider = window.ethereum.providers.find(
      (p: providers.ExternalProvider) => p.isMetaMask,
    );
    const networkHash: string = await metaMaskProvider.request?.({
      method: "eth_chainId",
    });

    return networkHash !== testnet
      ? { success: false, message: "Please switch to test net" }
      : { success: true };
  };

  const switchNetwork = async (): Promise<Status> => {
    if (
      window.ethereum === undefined ||
      window.ethereum.providers === undefined
    ) {
      return { success: false, message: "Please install MetaMask first!" };
    }
    const metaMaskProvider = window.ethereum.providers.find(
      (p: providers.ExternalProvider) => p.isMetaMask,
    );

    try {
      await metaMaskProvider.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });

      return { success: true };
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (
        switchError &&
        typeof switchError == "object" &&
        "code" in switchError &&
        switchError.code === 4902
      ) {
        try {
          await metaMaskProvider.request?.({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881",
                chainName: "Mumbai",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc-mumbai.polygon.technology"],
                blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
              },
            ],
          });

          await metaMaskProvider.request?.({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x13881" }],
          });

          return { success: true };
        } catch (addError) {
          console.log(addError);

          return {
            success: false,
            message: "Cannot add mumbai testnet to Metamask!",
          };
        }
      }
      return { success: false, message: "Please switch to mumbai testnet!" };
    }
  };

  return (
    <NetworkContext.Provider value={{ switchNetwork, getNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

const useNetwork = () => {
  const networkContext = useContext(NetworkContext);

  if (!networkContext) {
    throw new Error(
      "networkContext has to be used within <NetworkContext.Provider>",
    );
  }

  return networkContext;
};

export { NetworkProvider, useNetwork };
