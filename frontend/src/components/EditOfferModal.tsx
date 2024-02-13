import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
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
import { useWallet } from "@/context/walletProvider";
import { cn } from "@/lib/utils";
import { Offer } from "@/types/types";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { ReactNode, useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { CheckCircle2 } from "lucide-react";

type EditOfferModalProps = {
  offer: Offer;
  children: ReactNode;
};

const apiURL = import.meta.env.VITE_API_URL;

export const EditOfferModal: React.FC<EditOfferModalProps> = ({
  children,
  offer,
}) => {
  const [date, setDate] = useState<Date>();
  const [price, setPrice] = useState(offer.price);
  const { accountAddr } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    setDate(offer.expireAt);
  }, []);

  const placeOffer = async () => {
    if (price <= 0 || !accountAddr || !date) {
      console.log("continue: ", price, accountAddr, date);
      return;
    }

    const newOffer = {
      id: offer.id,
      price: price,
      createAt: new Date(),
      expireAt: date,
      fromAddress: accountAddr.toLowerCase(),
      nftId: offer.nftId,
    };

    const response = await fetch(`${apiURL}/offer/${offer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOffer),
    });

    await response.json();
  };

  const reset = () => {
    setPrice(offer.price);
    setDate(offer.expireAt);
  };

  const action = () => {
    placeOffer();
    toast({
      title: (
        <div className="flex items-center justify-start gap-1">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Edit Offer Success!
        </div>
      ),
      description: "Your NFT is created!",
    });
    window.location.reload();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className=" overflow-auto" onEscapeKeyDown={reset}>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit offer</AlertDialogTitle>
          <div className=" space-y-6 py-6">
            <div className="flex items-center justify-between rounded-lg border text-sm">
              {/* todo: add test, min=0 */}
              <input
                type="number"
                required
                className="w-full appearance-none rounded-lg rounded-r-none border-r p-3 text-gray-900 placeholder:text-gray-900 focus:outline-none"
                placeholder="Price"
                value={price}
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
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              action();
            }}
          >
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
