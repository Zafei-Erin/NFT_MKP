import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NFT } from "@/types/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import useSWR, { Fetcher } from "swr";
import { FetchRequest } from ".";

const apiURL = import.meta.env.VITE_API_URL;
const fetcher: Fetcher<NFT[], FetchRequest> = ({ url, params }) => {
  const newUrl = new URL(url);
  newUrl.search = new URLSearchParams(params).toString();
  return fetch(newUrl).then((data) => data.json());
};

type FetchQuery = {
  offset?: number;
  skip?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  filterBy?: keyof NFT;
  filterBool?: boolean;
};

export const CheapestNFTTable: React.FC = () => {
  const params: FetchQuery = {
    offset: 6,
    skip: 0,
    orderBy: "price",
    order: "asc",
    filterBy: "listed",
    filterBool: true,
  };
  const { data: nfts } = useSWR(
    { url: `${apiURL}/nfts`, params: params },
    fetcher,
    {
      suspense: true,
    },
  );

  const columns: ColumnDef<NFT>[] = [
    {
      id: "rank",
      header: "Rank",
      cell: ({ row }) => <div className="font-bold">{+row.id + 1}</div>,
    },
    {
      id: "collection",
      accessorFn: (row) => {
        return [row.imageUrl, row.name, row.creatorAddress];
      },
      header: () => <div className="text-start">Collection</div>,
      cell: (row) => {
        const [imageUrl, name, creatorAddress] = row.getValue();
        return (
          <div className="flex items-center justify-start gap-3">
            <img
              src={imageUrl}
              className="aspect-square w-auto min-w-12 max-w-16 rounded-lg"
            />
            <div className="space-y-2 text-left">
              <div className="font-semibold">{name}</div>
              <div className="flex items-center gap-1">
                <div className="text-xs">creator:</div>
                <div className="text-xs font-medium">
                  {creatorAddress.slice(0, 4) +
                    "..." +
                    creatorAddress.slice(38)}
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "listed",
      header: "Status",
      cell: (row) => <div>{row.getValue() ? "listing" : "not listing"}</div>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (row) => <div>{row.getValue() as number}</div>,
    },
  ];

  const table = useReactTable({
    data: nfts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="sm:w-full">
      <div className="text-xl font-semibold">Best Value NFTS</div>
      <div className="">
        <Table className="">
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
    </div>
  );
};
