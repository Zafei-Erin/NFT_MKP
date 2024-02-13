import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { EthPriceType, Offer } from "@/types/types";
import useSWR, { Fetcher } from "swr";

type OfferTableProps = {
  offers: Offer[];
};

type OfferWithUSD = Offer & { priceUSD: number };



const columnHelper = createColumnHelper<OfferWithUSD>();

const columns = [
  columnHelper.accessor("price", {
    header: ({ column }) => {
      return (
        <Button
          className="px-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="lowercase">{formatted}</div>;
    },
  }),
  columnHelper.accessor("priceUSD", {
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
      const priceUSD = parseFloat(row.getValue("priceUSD"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(priceUSD);

      return <div className="lowercase">{formatted}</div>;
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
  columnHelper.accessor("fromAddress", {
    header: () => <div>From</div>,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue<string>("fromAddress").slice(0, 4)}...
          {row.getValue<string>("fromAddress").slice(38)}
        </div>
      );
    },
  }),
];

const ES_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
const fetcher: Fetcher<EthPriceType, string> = (url: string) =>
  fetch(url)
    .then((data) => data.json())
    .then((res) => {
      return res.result;
    });

export const OfferTable: React.FC<OfferTableProps> = ({ offers }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const { data: ethPrice } = useSWR(
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ES_API_KEY}`,
    fetcher,
    { suspense: true },
  );
  const OfferWithUSD: OfferWithUSD[] = offers.map((origin) => {
    return { ...origin, priceUSD: origin.price * parseFloat(ethPrice.ethusd) };
  });

  const table = useReactTable({
    data: OfferWithUSD,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination: {
        pageSize: 4,
        pageIndex: pageIndex,
      },
    },
  });
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-6">
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPageIndex((prev) => prev - 1);
          }}
          disabled={!table.getCanPreviousPage()}
          className=" disabled:hidden"
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
          className=" disabled:hidden"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
