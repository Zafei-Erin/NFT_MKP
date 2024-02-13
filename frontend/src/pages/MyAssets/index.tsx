import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Created } from "./Created";
import { useWallet } from "@/context/walletProvider";
import { useEffect } from "react";
import { NotConnectedPage } from "@/components/NotConnectedPage";
import { Collected } from "./Collected";
import { useSearchParams } from "react-router-dom";
import { Offered } from "./Offered";

const DEFAULT_TAB = "collected";

export const MyAssets = () => {
  const { accountAddr, connect } = useWallet();
  const [searchParams, setSearchParams] = useSearchParams("tab");
  const tab = searchParams.get("tab");

  const updateTab = (selectedTab: string) => {
    setSearchParams({ tab: selectedTab });
  };

  useEffect(() => {
    console.log(tab);
    if (tab === "") {
      setSearchParams({ tab: DEFAULT_TAB });
    }
  }, []);

  useEffect(() => {
    if (accountAddr === "") {
      connect();
    }
  }, [accountAddr]);

  return (
    <div className="px-4 pb-6">
      <Tabs defaultValue={tab || DEFAULT_TAB}>
        <TabsList className="flex items-center justify-start gap-3 overflow-x-auto md:justify-evenly">
          {/* 买的: creator 不是自己，owner 是自己 */}
          <TabsTrigger
            value="collected"
            className="grow"
            onClick={() => updateTab("collected")}
          >
            Collected
          </TabsTrigger>
          {/* offers: creator 不是自己，owner 不是自己，expiration 还没到，*/}
          <TabsTrigger
            value="offers-made"
            className="grow"
            onClick={() => updateTab("offers-made")}
          >
            Offers made
          </TabsTrigger>
          {/* created: creator 是自己*/}
          <TabsTrigger
            value="created"
            className="grow"
            onClick={() => updateTab("created")}
          >
            Created
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collected">
          {accountAddr ? <Collected /> : <NotConnectedPage />}
        </TabsContent>
        <TabsContent value="created">
          {accountAddr ? <Created /> : <NotConnectedPage />}
        </TabsContent>
        <TabsContent value="offers-made">
          {accountAddr ? <Offered /> : <NotConnectedPage />}
        </TabsContent>
      </Tabs>
    </div>
  );
};
