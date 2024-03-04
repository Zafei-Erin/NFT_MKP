import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useLocation } from "react-router-dom";

import { ErrorPage } from "@/components/ErrorPage";
import { Suspense } from "react";
import { Header } from "./components/header/Header";
import { LoadingPage } from "./components/LoadingPage";
import { WalletProvider } from "./context/walletProvider";
import { Create } from "./pages/Create";
import { Home } from "./pages/Home";
import { Item } from "./pages/Item";
import { MyAssets } from "./pages/MyAssets";
import { Toaster } from "./components/ui/toaster";
import { TestButton } from "./pages/test";
import { NetworkProvider } from "./context/networkProvider/networkProvider";

function App() {
  const RRLocation = useLocation();
  const { pathname } = RRLocation;
  return (
    <div className="">
      <WalletProvider>
        <NetworkProvider>
          {pathname !== "/" && <Header />}

          <ErrorBoundary fallback={<ErrorPage />} onReset={location.reload}>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Create />} />
                <Route path="/item/:tokenId" element={<Item />} />
                <Route path="/myAssets" element={<MyAssets />} />
                <Route path="/test" element={<TestButton />} />
              </Routes>
            </Suspense>
            <Toaster />
          </ErrorBoundary>
        </NetworkProvider>
      </WalletProvider>
    </div>
  );
}

export default App;
