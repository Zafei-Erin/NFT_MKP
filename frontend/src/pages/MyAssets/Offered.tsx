import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EthPriceType, Offer } from "@/types/types";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useSWR, { Fetcher } from "swr";

import { useWallet } from "@/context/walletProvider";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { EditIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EditOfferModal } from "@/components/EditOfferModal";
import { RemoveOfferModal } from "@/components/RemoveOfferModal";

const apiURL = import.meta.env.VITE_API_URL;
const ES_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
const offerFetcher: Fetcher<Offer[], string> = (url: string) =>
  fetch(url).then((data) => data.json());
const ethPricefetcher: Fetcher<EthPriceType, string> = (url: string) =>
  fetch(url)
    .then((data) => data.json())
    .then((res) => {
      return res.result;
    });

export const Offered: React.FC = () => {
  const { accountAddr } = useWallet();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const { data: offers } = useSWR(
    `${apiURL}/user/${accountAddr}/offered`,
    offerFetcher,
    {
      suspense: true,
    },
  );
  const { data: ethPrice } = useSWR(
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ES_API_KEY}`,
    ethPricefetcher,
    { suspense: true },
  );
  const columnHelper = createColumnHelper<Offer>();
  const columns = [
    columnHelper.accessor((row) => row, {
      id: "edit",
      header: () => <></>,
      cell: (row) => {
        const offer = row.getValue();
        return (
          <EditOfferModal offer={offer}>
            <EditIcon className="h-4 w-4 stroke-gray-600 hover:cursor-pointer hover:stroke-gray-400" />
          </EditOfferModal>
        );
      },
    }),
    columnHelper.accessor("nft", {
      id: "collection",
      header: () => (
        <div className="text-start font-medium text-gray-900">Collection</div>
      ),
      cell: (row) => {
        const nft = row.getValue();
        return (
          <Link
            to={`/item/${nft.tokenId}}`}
            className="flex w-full items-center justify-start gap-3 rounded-lg p-2 hover:bg-gray-200"
          >
            <img
              src={nft.imageUrl}
              className="aspect-square w-auto min-w-12 max-w-16 rounded-lg"
            />
            <div className="space-y-2 text-left">
              <div className="font-semibold">{nft.name}</div>
              <div className="flex items-center gap-1">
                <div className="text-xs">creator:</div>
                <div className="text-xs font-medium">
                  {nft.creatorAddress.slice(0, 4) +
                    "..." +
                    nft.creatorAddress.slice(38)}
                </div>
              </div>
            </div>
          </Link>
        );
      },
    }),
    columnHelper.accessor("price", {
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Offer Price
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));

        const formatted = new Intl.NumberFormat(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }).format(price);

        return <div>${formatted}</div>;
      },
    }),
    columnHelper.accessor("price", {
      id: "usdPrice",
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            USD Price
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const priceUSD =
          parseFloat(row.getValue("price")) * parseFloat(ethPrice.ethusd);
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(priceUSD);

        return <div>{formatted}</div>;
      },
    }),
    columnHelper.accessor("expireAt", {
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Expiration
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const expiration = new Date(row.getValue("expireAt"));
        const formatted = new Intl.DateTimeFormat(undefined).format(expiration);

        return <div className="">{formatted}</div>;
      },
    }),
    columnHelper.accessor((row) => row, {
      id: "remove",
      header: "",
      cell: (row) => {
        const offer = row.getValue();
        return (
          <RemoveOfferModal offer={offer}>
            <Trash2 className="h-4 w-4 stroke-gray-600 hover:cursor-pointer hover:stroke-red-400" />
          </RemoveOfferModal>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: offers,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageSize: 15,
        pageIndex: pageIndex,
      },
    },
  });

  return (
    <div className="mx-auto my-10 sm:w-full lg:max-w-screen-xl">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="px-6 text-center font-light text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="h-28 border-0">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-6 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPageIndex((prev) => prev - 1);
          }}
          disabled={!table.getCanPreviousPage()}
          className=""
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPageIndex((prev) => prev + 1);
          }}
          disabled={!table.getCanNextPage()}
          className=""
        >
          Next
        </Button>
      </div>
    </div>
  );
};
