/// <reference types="vite/client" />
import { MetaMaskInpageProvider } from "@ethersproject/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
