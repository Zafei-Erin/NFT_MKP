import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { NFT } from "@/types/types";
import { ReactNode } from "react";

type BuyModalProps = {
  item: NFT;
  children: ReactNode;
  action: () => void;
};

export const BuyModal: React.FC<BuyModalProps> = ({
  children,
  item,
  action,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className=" overflow-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Review your purchase</AlertDialogTitle>
          <AlertDialogDescription>
            <div>
              <Table>
                <TableRow className="border-b-0">
                  <TableHead>Collection name</TableHead>
                  <TableCell>{item.name}</TableCell>
                </TableRow>
                <TableRow className="border-b-0">
                  <TableHead>Creator</TableHead>
                  <TableCell className="overflow break-words">
                    {item.creatorAddress}
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-0">
                  <TableHead>Total sales</TableHead>
                  <TableCell>
                    {item.sales.length.toLocaleString()} sales
                  </TableCell>
                </TableRow>
                <TableRow className="border-b-0">
                  <TableHead>Price</TableHead>
                  <TableCell>{item.price}</TableCell>
                </TableRow>
              </Table>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={action}>Continue</AlertDialogAction>
        </AlertDialogFooter>

        <></>
      </AlertDialogContent>
    </AlertDialog>
  );
};
