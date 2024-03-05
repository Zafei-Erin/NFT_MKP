import { useMemo, useState } from "react";
import { GetOffersRequest } from "@zafei/nft_mkp_types";
import useSWR, { Fetcher } from "swr";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { EditIcon, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { EthPriceType, Offer } from "@/types/types";
import { FetchWithParams } from "@/types/fetchers";
import { RemoveOfferModal } from "@/components/RemoveOfferModal";
import { EditOfferModal } from "@/components/EditOfferModal";
import { useWallet } from "@/context/walletProvider";
import { cn } from "@/lib/utils";

type OfferTableProps = {
  nftId: number;
};
type OfferWithUSD = Offer & { priceUSD: number };
type SortByParams = Pick<GetOffersRequest, "sortBy" | "sortDir">;

const apiURL = import.meta.env.VITE_API_URL;
const ES_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY;
const PAGE_SIZE = 4;

const ethFetcher: Fetcher<EthPriceType, string> = (url: string) =>
  fetch(url)
    .then((data) => data.json())
    .then((res) => {
      return res.result;
    });
const offerFetcher: Fetcher<
  { offers: Offer[] } & { total: string },
  FetchWithParams
> = ({ url, params }) => {
  const newUrl = new URL(url);
  newUrl.search = new URLSearchParams(params).toString();
  return fetch(newUrl).then((data) => data.json());
};

export const OfferTable: React.FC<OfferTableProps> = ({ nftId }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortByParams, setSortByParams] = useState<SortByParams>({
    sortBy: "createAt",
    sortDir: "desc",
  });
  const { accountAddr } = useWallet();
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );
  const { data: ethPrice } = useSWR(
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ES_API_KEY}`,
    ethFetcher,
    { suspense: true },
  );

  const params: GetOffersRequest = {
    take: PAGE_SIZE,
    skip: pageIndex * pageSize,
    sortBy: sortByParams.sortBy,
    sortDir: sortByParams.sortDir,
  };
  const { data: resp } = useSWR(
    { url: `${apiURL}/offers/${nftId}`, params: params },
    offerFetcher,
    {
      suspense: true,
    },
  );

  const offers = resp.offers;
  const OfferWithUSD: OfferWithUSD[] = offers.map((origin) => {
    return { ...origin, priceUSD: origin.price * parseFloat(ethPrice.ethusd) };
  });

  const columnHelper = createColumnHelper<OfferWithUSD>();
  const columns = [
    columnHelper.accessor("price", {
      header: ({ column }) => {
        return (
          <Button
            className="px-0"
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
              setSortByParams({
                sortBy: "price",
                sortDir: column.getIsSorted() === "asc" ? "desc" : "asc",
              });
            }}
          >
            Price
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));

        const formatted = new Intl.NumberFormat(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 8,
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
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
              setSortByParams({
                sortBy: "price",
                sortDir: column.getIsSorted() === "asc" ? "desc" : "asc",
              });
            }}
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
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc");
              setSortByParams({
                sortBy: "expireAt",
                sortDir: column.getIsSorted() === "asc" ? "desc" : "asc",
              });
            }}
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
        const addr =
          row.getValue<string>("fromAddress").slice(0, 4) +
          "..." +
          row.getValue<string>("fromAddress").slice(38);
        return <div>{addr === accountAddr ? "me" : addr}</div>;
      },
    }),
    columnHelper.accessor((row) => row, {
      id: "action",
      header: "",
      cell: (row) => {
        const offer = row.getValue();
        const isOfferer =
          accountAddr.toLowerCase() !== offer.fromAddress.toLowerCase()
            ? false
            : true;

        return (
          <div>
            {
              <div className="flex gap-3">
                <EditOfferModal offer={offer}>
                  <EditIcon
                    className={cn(
                      "h-4 w-4 stroke-gray-400",
                      !isOfferer
                        ? "hover:cursor-not-allowed "
                        : " hover:cursor-pointer hover:stroke-gray-600",
                    )}
                    onClick={(e) => {
                      if (!isOfferer) {
                        e.preventDefault();
                      }
                    }}
                  />
                </EditOfferModal>
                <RemoveOfferModal offer={offer}>
                  <Trash2
                    className={cn(
                      "h-4 w-4 stroke-gray-400",
                      !isOfferer
                        ? "hover:cursor-not-allowed "
                        : "hover:cursor-pointer hover:stroke-red-400",
                    )}
                    onClick={(e) => {
                      if (!isOfferer) {
                        e.preventDefault();
                      }
                    }}
                  />
                </RemoveOfferModal>
              </div>
            }
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: OfferWithUSD,
    columns,
    manualPagination: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    pageCount: parseInt(resp.total) || 0,
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
            {table.getRowModel().rows.length ? (
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
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
