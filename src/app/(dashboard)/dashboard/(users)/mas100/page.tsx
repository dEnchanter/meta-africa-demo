'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from '@/util/axios'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import toast from 'react-hot-toast'
import { Endpoint } from "@/util/constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, PlayCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { calculateStarRating } from "@/helper/calculateStarRating";
import RatingComponent from "@/components/RatingComponent";
import Link from "next/link";
import { abbreviateBasketballPosition } from "@/helper/abbreviatePositionName";
import { useUser } from "@/hooks/auth";
import { useState } from "react";

type PositionBadgeProps = {
  position: string;
};

const columns: ColumnDef<Player>[] = [
  {
    id: 'sn',
    header: 'S/N',
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "name", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
    header: "Player Name",
    cell: (info) => (
      <div className="flex items-center">
        <img 
          src={info.row.original.avatar} // Use the avatar URL from the data
          alt="Avatar"
          onError={(e) => e.currentTarget.src = '/meta-africa-logo.png'}
          style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }} // Adjust styling as needed
        />
        {String(info.getValue())}
      </div>
    ),
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: (info) => <PositionBadge position={info.getValue() as string} />,
  },
  {
    accessorKey: "height", // Use one of the keys to ensure proper data mapping
    header: "Ht/Wt",
    cell: (info) => {
      const height = info.row.original.height; // Access height from the row data
      const weight = info.row.original.weight; // Access weight from the row data
      return `${height} / ${weight}`; // Format: height / weight
    },
  },
  {
    accessorKey: 'regional_rank', // Just need one key to access the full row data
    header: 'Rating',
    cell: (info) => {
      // Extract the relevant ranks from the row data
      const regional_rank = parseInt(info.row.original.regional_rank ?? "0");
      const position_rank = parseInt(info.row.original.position_rank ?? "0");
      const country_rank = parseInt(info.row.original.country_rank ?? "0");
  
      // Calculate the star rating
      const rating = calculateStarRating({ regional_rank, position_rank, country_rank });
      // Return the rating, perhaps wrapped in a visual component that displays stars
      return <RatingComponent rating={rating} />;
    },
  },
  {
    accessorKey: "wingspan", // Assuming 'name' and 'avatar' are the keys for player name and avatar URL
    header: "Wing Span",
    cell: (info) => (
      <div className="flex items-center">
        {String(info.getValue())}
      </div>
    ),
  },
  {
    id: 'viewProfile',
    header: 'Actions',
    cell: (info) => 
    <Link
      className="text-yellow-600 text-sm"
      href={`/dashboard/mas100/${info.row.original._id}`}
    >
      View Profile
    </Link>,
  },
]

const PositionBadge: React.FC<PositionBadgeProps> = ({ position }) => (
  <span className="border px-2 py-1 rounded text-sm">
    {abbreviateBasketballPosition(position)}
  </span>
);

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface FetchPlayersParams {
  pageIndex?: number;
  pageSize?: number;
  filters?: any[];
  // ... other parameters
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
 
  return (
    <div className="rounded-md text-white">
      <Table className="hover:bg-transparent">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow 
              key={headerGroup.id}
              className="hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-transparent border-gray-50/20 "
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const MASTable = () => {

  const pageIndex = 0;
  const pageSize = 10;

  const {
    user
  } = useUser({
    redirectTo: "/login",
  });

  const [pageCount, setPageCount] = useState("--");
  const [filters, setFilters] = useState([]);

  const {
    data: getAllPlayersData,
    mutate: refetchPlayers
  } = useSWR(
    user?.status == 'success' ?  [Endpoint, filters] : null,
    () => fetchPlayers(Endpoint, { pageIndex, pageSize, filters }),
  );

  async function fetchPlayers(
    Endpoint: any,  
    { pageIndex, pageSize, filters, ...rest }: FetchPlayersParams
  ) {

    let userFilter = filters?.reduce((acc: any, aFilter: any) => {
      if (aFilter.value) {
        acc[aFilter.id] = aFilter.value;
      }
      return acc;
    }, {});

    // Provide a default value for pageIndex if it's undefined
    const currentPageIndex = pageIndex ?? 0;
    const currentPageSize = pageSize ?? 3;

    try {
      const response = await axios.get(Endpoint.GET_ALL_PLAYERS, {
        params: {
          page: currentPageIndex + 1,
          limit: currentPageSize || 10,
          ...userFilter,
        },
      })
      const payload = response.data;
      if (payload && payload.status == "success") {

        setPageCount(Math.ceil(payload.totalPages / currentPageSize).toString());

        return {
          data: payload.data,
          players: payload.data.players,
          currentPage: payload.data.currentPage,
          totalPages: payload.data.totalPages,
        };
      }
    } catch (error) {
      toast.error("Something went wrong");

      // TODO Implement more specific error messages
      // throw new Error("Something went wrong");
    }
  }

  return (
    <Card className="bg-[rgb(36,36,36)] border-0 mb-[5rem]">
      <CardHeader>
        <CardTitle className="">
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-2 border-zinc-100/10 px-2 py-1 rounded-full text-white text-xs flex items-center">
                      <p className="text-zinc-100">Gender</p> 
                      <ChevronDown className="h-4 w-4 mt-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Male</DropdownMenuItem>
                      <DropdownMenuItem>Female</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-2 border-zinc-100/10 px-2 py-1 rounded-full text-white text-xs flex items-center">
                      <p className="text-zinc-100">Region</p> 
                      <ChevronDown className="h-4 w-4 mt-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>West Africa</DropdownMenuItem>
                      <DropdownMenuItem>South Africa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-2 border-zinc-100/10 px-2 py-1 rounded-full text-white text-xs flex items-center">
                      <p className="text-zinc-100">Country</p> 
                      <ChevronDown className="h-4 w-4 mt-1" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Mali</DropdownMenuItem>
                      <DropdownMenuItem>Nigeria</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="">
                <Input 
                  className="bg-transparent border-2 border-zinc-100/10 rounded-full text-white" 
                  placeholder="Search players"
                />
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <DataTable columns={columns} data={getAllPlayersData?.players || []} />
      </CardContent>
    </Card>
  )
}

const Page = () => {
  return (
    <div className="bg-[rgb(20,20,20)] h-screen p-3 overflow-y-auto scrollbar-hide">
      <h1 className="text-2xl text-white font-semibold p-2">MAS 100</h1>
      <MASTable />
    </div>
  )
}

export default Page