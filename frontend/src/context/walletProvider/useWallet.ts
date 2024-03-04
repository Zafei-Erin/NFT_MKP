import { useContext } from "react";
import { WalletContext } from "./WalletProvider";

export const useWallet = () => {
  const userAccContext = useContext(WalletContext);

  if (!userAccContext) {
    throw new Error(
      "UserAccContext has to be used within <UserAccContext.Provider>",
    );
  }

  return userAccContext;
};
