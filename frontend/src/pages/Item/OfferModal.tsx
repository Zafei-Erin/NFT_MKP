import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useNetwork } from "@/context/networkProvider/networkProvider";
import { useWallet } from "@/context/walletProvider";
import { cn } from "@/lib/utils";

type OfferModalProps = {
  tokenId: number;
  children: ReactNode;
};

const apiURL = import.meta.env.VITE_API_URL;
const DEFAULT_EXPIRE_AT = 3;

export const OfferModal: React.FC<OfferModalProps> = ({
  children,
  tokenId,
}) => {
  const [date, setDate] = useState<Date>();
  const [price, setPrice] = useState(0);
  const { accountAddr } = useWallet();
  const { getNetwork } = useNetwork();
  const { toast } = useToast();
  const [disabled, setDisabled] = useState<boolean>();

  useEffect(() => {
    check();

    async function check() {
      const isTestnet = await getNetwork();
      if (!isTestnet.success || !accountAddr || price <= 0 || !price || !date) {
        setDisabled(true);
        return;
      }
      setDisabled(false);
    }
  }, [getNetwork, accountAddr, price, date]);

  useEffect(() => {
    setDate(addDays(new Date(), DEFAULT_EXPIRE_AT));
  }, []);

  const placeOffer = async () => {
    if (!accountAddr || price <= 0 || !price || !date) {
      reset();
      return;
    }

    try {
      const offer = {
        price: price,
        createAt: new Date(),
        expireAt: date,
        fromAddress: accountAddr.toLowerCase(),
        tokenId: tokenId,
      };

      const response = await fetch(`${apiURL}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offer),
      });
      await response.json();
      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            Place Offer Successfully!
          </div>
        ),
        description: "Your offer is created!",
      });
      window.location.reload();
    } catch (error) {
      console.log(error);

      toast({
        title: (
          <div className="flex items-center justify-start gap-1">
            <XCircle className="h-5 w-5 text-red-600" />
            Failed to place order
          </div>
        ),
        description: <>Something went wrong</>,
      });
    }
  };

  const reset = () => {
    setPrice(0);
    setDate(addDays(new Date(), DEFAULT_EXPIRE_AT));
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogOverlay className="bg-black/10" />
      <AlertDialogContent className=" overflow-auto" onEscapeKeyDown={reset}>
        <AlertDialogHeader>
          <AlertDialogTitle>Make an offer</AlertDialogTitle>
          <div className=" space-y-6 py-6">
            <div className="flex items-center justify-between rounded-lg border text-sm">
              {/* todo: add test, min=0 */}
              <input
                type="number"
                required
                className="w-full appearance-none rounded-lg rounded-r-none border-r p-3 text-gray-900 placeholder:text-gray-900 focus:outline-none"
                placeholder="Price"
                onChange={(e) => setPrice(e.target.valueAsNumber)}
              />
              <div className="basis-1/5 px-3 font-semibold text-gray-900">
                ETH
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-left font-semibold text-gray-950">
                Expire at:
              </p>
              <DatePicker date={date} setDate={setDate} />
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={disabled} onClick={placeOffer}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type DatePickerProps = {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate }) => {
  return (
    <div className="flex items-center justify-start gap-2">
      <Select
        onValueChange={(value) => setDate(addDays(new Date(), parseInt(value)))}
        defaultValue={DEFAULT_EXPIRE_AT.toString()}
      >
        <SelectTrigger className="w-full text-gray-800 max-sm:flex-1 sm:basis-1/3">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="0">Today</SelectItem>
          <SelectItem value="1">Tomorrow</SelectItem>
          <SelectItem value="3">In 3 days</SelectItem>
          <SelectItem value="7">In a week</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full flex-1 justify-start text-left font-normal text-gray-900 sm:min-w-[240px]",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-900" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="flex w-auto flex-col space-y-2 p-2"
        >
          <div className="rounded-md border">
            <Calendar
              mode="single"
              fromDate={new Date()}
              selected={date}
              onSelect={setDate}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
